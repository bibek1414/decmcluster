"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useSendNewsletterEmail } from "@/hooks/use-newsletter";
import { useSendClusterContactEmail } from "@/hooks/use-cluster-contacts";
import { newsletterService } from "@/services/newsletter";
import { userService } from "@/services/user";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { MultiEmailInput } from "@/components/ui/multi-email-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  Mail,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Eye,
  Info,
  Contact,
  UserCheck,
} from "lucide-react";

type DispatchMode = "newsletter" | "cluster_contacts";

export function SendEmailView() {
  const { token, user } = useAuth();
  const searchParams = useSearchParams();

  const [dispatchMode, setDispatchMode] = useState<DispatchMode>("newsletter");
  const [subject, setSubject] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [sendToAllSubscribers, setSendToAllSubscribers] = useState(false);
  const [sendToAllClusterContacts, setSendToAllClusterContacts] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Custom hooks for dispatching emails
  const sendNewsletterMutation = useSendNewsletterEmail();
  const sendClusterContactMutation = useSendClusterContactEmail();

  const isPending =
    sendNewsletterMutation.isPending || sendClusterContactMutation.isPending;

  // Sync mode with URL query params or sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const modeParam = searchParams.get("mode");
      if (modeParam === "cluster_contacts") {
        setDispatchMode("cluster_contacts");
      } else {
        setDispatchMode("newsletter");
      }

      const stored = sessionStorage.getItem("decm_newsletter_recipient_emails");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setEmails((prev) => Array.from(new Set([...prev, ...parsed])));
            setDispatchMode("cluster_contacts");
            toast.info(`Preloaded ${parsed.length} recipient email(s) from Cluster Contacts.`);
          }
        } catch {
          // ignore
        }
        sessionStorage.removeItem("decm_newsletter_recipient_emails");
      }
    }
  }, [searchParams]);

  // Query system users for recipient picker
  const {
    data: systemUsersData,
    isLoading: isLoadingSystemUsers,
    refetch: refetchSystemUsers,
  } = useQuery({
    queryKey: ["system-users-for-newsletter", token],
    queryFn: () => userService.list(1, token, "", 1000),
    enabled: false,
  });

  const systemUsersList =
    systemUsersData?.results?.map((u) => ({
      email: u.email,
      name: u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : undefined,
      role: u.role,
    })) || [];

  // Query newsletter subscribers for recipient picker
  const {
    data: subscribersData,
    isLoading: isLoadingSubscribers,
    refetch: refetchSubscribers,
  } = useQuery({
    queryKey: ["subscribers-for-newsletter", token],
    queryFn: () => newsletterService.list(1, token, "", 1000),
    enabled: false,
  });

  const subscribersList =
    subscribersData?.results?.map((s) => ({
      email: s.email,
      is_subscribed: s.is_subscribed,
      created_at: s.created_at,
    })) || [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Please enter a subject line.");
      return;
    }

    if (dispatchMode === "newsletter" && !sendToAllSubscribers && emails.length === 0) {
      toast.error(
        "Please add recipient email address(es) or check 'Send to all active newsletter subscribers'."
      );
      return;
    }

    if (dispatchMode === "cluster_contacts" && !sendToAllClusterContacts && emails.length === 0) {
      toast.error(
        "Please add recipient email address(es) or check 'Send to all active cluster contacts roster'."
      );
      return;
    }

    if (!body.trim()) {
      toast.error("Please compose email body content.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSend = () => {
    if (dispatchMode === "newsletter") {
      sendNewsletterMutation.mutate(
        {
          payload: {
            subject: subject.trim(),
            body: body.trim(),
            emails: sendToAllSubscribers ? [] : emails,
          },
          token,
        },
        {
          onSuccess: (data) => {
            const recipientText = sendToAllSubscribers
              ? "all active subscribers"
              : `${emails.length} recipient(s)`;
            toast.success(
              data?.message || `Newsletter successfully sent to ${recipientText}!`
            );
            handleResetForm();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to send newsletter. Please try again.");
            setShowConfirmModal(false);
          },
        }
      );
    } else {
      sendClusterContactMutation.mutate(
        {
          payload: {
            subject: subject.trim(),
            body: body.trim(),
            emails: sendToAllClusterContacts ? [] : emails,
          },
          token,
        },
        {
          onSuccess: (data) => {
            const recipientText = sendToAllClusterContacts
              ? "all cluster contacts"
              : `${emails.length} contact(s)`;
            toast.success(
              data?.message || `Broadcast successfully sent to ${recipientText}!`
            );
            handleResetForm();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to send email to cluster contacts.");
            setShowConfirmModal(false);
          },
        }
      );
    }
  };

  const handleResetForm = () => {
    setSubject("");
    setEmails([]);
    setBody("");
    setSendToAllSubscribers(false);
    setSendToAllClusterContacts(false);
    setShowConfirmModal(false);
  };

  const handleManualReset = () => {
    if (confirm("Are you sure you want to reset all fields in this form?")) {
      handleResetForm();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-muted border border-border text-foreground">
                {dispatchMode === "newsletter" ? (
                  <Mail className="w-5 h-5 text-foreground" />
                ) : (
                  <Contact className="w-5 h-5 text-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  {dispatchMode === "newsletter"
                    ? "Send Email Newsletter"
                    : "Send Cluster Contact Email"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {dispatchMode === "newsletter"
                    ? "Compose and dispatch custom email broadcasts to public web subscribers."
                    : "Send official coordination notices, sitreps, and memos to DECM Cluster contacts."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleManualReset}
              disabled={isPending}
              className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer hover:bg-muted"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleFormSubmit}
              disabled={isPending}
              className="text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  {dispatchMode === "newsletter" ? "Send Newsletter" : "Send Cluster Email"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Dedicated Quick Navigation Tabs */}
        <div className="flex items-center gap-2">
          {dispatchMode === "newsletter" ? (
            <>
              <Link
                href="/assement/newsletter/subscribers"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent transition-all"
              >
                Subscribers List
              </Link>
              <Link
                href="/assement/newsletter/send-email?mode=newsletter"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted text-foreground border border-border transition-all shadow-2xs"
              >
                Send Newsletter
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/assement/newsletter/contacts"
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent transition-all"
              >
                Cluster Contact List
              </Link>
              <Link
                href="/assement/newsletter/send-email?mode=cluster_contacts"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-muted text-foreground border border-border transition-all shadow-2xs"
              >
                Send Cluster Contact Email
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Form vs Live Inbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  Subject Line <span className="text-rose-500">*</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {subject.length} / 150
                </span>
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  dispatchMode === "newsletter"
                    ? "Enter newsletter subject line..."
                    : "Enter cluster email subject line..."
                }
                disabled={isPending}
                maxLength={150}
                className="text-xs py-2.5 px-3.5 bg-background border-border rounded-xl focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>

            {/* Target Audience Option */}
            <div className="space-y-3">
              {dispatchMode === "newsletter" ? (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendToAllSubscribers}
                      onChange={(e) => setSendToAllSubscribers(e.target.checked)}
                      disabled={isPending}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring accent-primary cursor-pointer shrink-0"
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground">
                        Send to all active newsletter subscribers
                      </span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendToAllClusterContacts}
                      onChange={(e) => setSendToAllClusterContacts(e.target.checked)}
                      disabled={isPending}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-ring accent-primary cursor-pointer shrink-0"
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <Contact className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground">
                        Send to all active cluster contacts roster
                      </span>
                    </div>
                  </label>
                </div>
              )}

              {/* Multi-email recipient picker */}
              <MultiEmailInput
                emails={emails}
                onChange={setEmails}
                mode={dispatchMode}
                disabled={
                  isPending ||
                  (dispatchMode === "newsletter" && sendToAllSubscribers) ||
                  (dispatchMode === "cluster_contacts" && sendToAllClusterContacts)
                }
                sendToAllSubscribers={
                  (dispatchMode === "newsletter" && sendToAllSubscribers) ||
                  (dispatchMode === "cluster_contacts" && sendToAllClusterContacts)
                }
                onFetchSystemUsers={() => refetchSystemUsers()}
                isLoadingSystemUsers={isLoadingSystemUsers}
                systemUsersList={systemUsersList}
                onFetchSubscribers={() => refetchSubscribers()}
                isLoadingSubscribers={isLoadingSubscribers}
                subscribersList={subscribersList}
              />
            </div>

            {/* Email Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                Email Body <span className="text-rose-500">*</span>
              </label>

              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write your email body content here..."
                disabled={isPending}
                height="380px"
              />
            </div>

            {/* Action Footer */}
            <div className="pt-3 flex items-center justify-end border-t border-border">
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isPending}
                className="text-xs font-semibold gap-1.5 rounded-xl cursor-pointer shadow-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    {dispatchMode === "newsletter" ? "Send Newsletter" : "Send Cluster Email"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-muted-foreground" />
              Live Inbox Preview
            </h3>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            {/* Header info */}
            <div className="space-y-2.5 pb-3 border-b border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {subject || "(No Subject)"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    From: <span className="font-semibold text-foreground">{user?.email || "system@decmcluster.org"}</span>
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                  Now
                </span>
              </div>

              {/* To field */}
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border text-xs">
                <span className="text-[11px] text-muted-foreground font-medium">To: </span>
                {dispatchMode === "newsletter" && sendToAllSubscribers ? (
                  <span className="text-[11px] font-semibold text-foreground">
                    All Active Newsletter Subscribers
                  </span>
                ) : dispatchMode === "cluster_contacts" && sendToAllClusterContacts ? (
                  <span className="text-[11px] font-semibold text-foreground">
                    All Active Cluster Contacts Roster
                  </span>
                ) : emails.length > 0 ? (
                  <span className="text-[11px] font-semibold text-foreground">
                    {emails.slice(0, 3).join(", ")}
                    {emails.length > 3 ? ` +${emails.length - 3} more` : ""}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground italic">
                    No recipients added yet
                  </span>
                )}
              </div>
            </div>

            {/* Newsletter HTML Email Preview Card */}
            <div className="max-h-[480px] overflow-y-auto rounded-xl border border-border bg-[#f9fafc] dark:bg-muted/20 p-2.5 sm:p-3 text-left">
              <table border={0} cellPadding={0} cellSpacing={0} width="100%" className="w-full">
                <tbody>
                  <tr>
                    <td align="center">
                      <table
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                        className="w-full max-w-[560px] bg-white dark:bg-card rounded-xl border border-[#eaecf0] dark:border-border shadow-xs overflow-hidden text-left"
                      >
                        <tbody>
                          {/* Header image using /image.png */}
                          <tr>
                            <td className="p-0 bg-[#1e3a8a] overflow-hidden rounded-t-xl">
                              <img
                                src="/image.png"
                                alt="DECM Cluster Newsletter Header"
                                className="w-full max-w-[560px] h-auto block object-cover rounded-t-xl"
                              />
                            </td>
                          </tr>

                          {/* Body Content */}
                          <tr>
                            <td className="p-5 sm:p-6 text-xs sm:text-sm text-[#344054] dark:text-card-foreground leading-relaxed min-h-[140px]">
                              {body ? (
                                <div
                                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed [&_a]:text-[#2563eb] [&_a]:underline"
                                  dangerouslySetInnerHTML={{ __html: body }}
                                />
                              ) : (
                                <div className="py-10 text-center text-muted-foreground space-y-1.5">
                                  <Info className="w-6 h-6 mx-auto opacity-40 text-muted-foreground" />
                                  <p className="text-xs">No email content typed yet. Type in the editor to preview.</p>
                                </div>
                              )}
                            </td>
                          </tr>

                          {/* Footer */}
                          <tr>
                            <td className="px-5 py-4 sm:px-6 sm:py-4 bg-[#f9fafb] dark:bg-muted/40 border-t border-[#f2f4f7] dark:border-border rounded-b-xl">
                              <table border={0} cellPadding={0} cellSpacing={0} width="100%">
                                <tbody>
                                  <tr>
                                    <td align="left" className="text-[11px] text-[#98a2b3] dark:text-muted-foreground leading-relaxed">
                                      Displacement &amp; Evacuation Centre Management (DECM) Cluster<br />
                                      {dispatchMode === "newsletter" ? (
                                        <>
                                          This is an automated newsletter broadcast. If you wish to unsubscribe, please{" "}
                                          <a
                                            href="https://www.decmcluster.org/newsletter/unsubscribe"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[#2563eb] underline hover:opacity-80"
                                          >
                                            click here
                                          </a>.
                                        </>
                                      ) : (
                                        <>
                                          Official Cluster Focal Points Directory Notice. For official roster updates, please contact NDMO.
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Send Email</h3>
                <p className="text-xs text-muted-foreground">
                  Are you sure you want to send this email broadcast?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground font-medium">Subject:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">{subject}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground font-medium">Recipients:</span>
                {dispatchMode === "newsletter" && sendToAllSubscribers ? (
                  <span className="font-semibold text-foreground text-xs">
                    All Active Newsletter Subscribers
                  </span>
                ) : dispatchMode === "cluster_contacts" && sendToAllClusterContacts ? (
                  <span className="font-semibold text-foreground text-xs">
                    All Active Cluster Contacts Roster
                  </span>
                ) : (
                  <span className="font-semibold text-foreground">{emails.length} address(es)</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
                className="text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleConfirmSend}
                disabled={isPending}
                className="text-xs font-semibold gap-1.5 rounded-xl shadow-xs cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
