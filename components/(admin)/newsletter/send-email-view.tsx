"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
  ShieldCheck,
} from "lucide-react";

export function SendEmailView() {
  const { token, user } = useAuth();
  const [subject, setSubject] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Query system users for email quick-select
  const {
    data: systemUsersData,
    isLoading: isLoadingSystemUsers,
    refetch: refetchSystemUsers,
  } = useQuery({
    queryKey: ["system-users-for-newsletter", token],
    queryFn: () => userService.list(1, token, ""),
    enabled: false,
  });

  const systemUsersList =
    systemUsersData?.results?.map((u) => ({
      email: u.email,
      name: u.first_name || u.last_name ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : undefined,
      role: u.role,
    })) || [];

  // Mutation to send newsletter email
  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      if (!subject.trim()) {
        throw new Error("Subject line is required.");
      }
      if (emails.length === 0) {
        throw new Error("Please add at least one recipient email address.");
      }
      if (!body.trim()) {
        throw new Error("Email body content cannot be empty.");
      }

      return newsletterService.sendEmail(
        {
          subject: subject.trim(),
          body: body.trim(),
          emails: emails,
        },
        token
      );
    },
    onSuccess: (data) => {
      const sentCount = data?.sent_count ?? emails.length;
      toast.success(
        data?.message || `Newsletter successfully sent to ${sentCount} recipient(s)!`
      );
      setSubject("");
      setEmails([]);
      setBody("");
      setShowConfirmModal(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send email. Please try again.");
      setShowConfirmModal(false);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Please enter a subject line.");
      return;
    }
    if (emails.length === 0) {
      toast.error("Please add at least one recipient email address.");
      return;
    }
    if (!body.trim()) {
      toast.error("Please compose email body content.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all fields in this form?")) {
      setSubject("");
      setEmails([]);
      setBody("");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Send Email Newsletter
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Compose and send emails to recipients or system users.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={sendEmailMutation.isPending}
            className="text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleFormSubmit}
            disabled={sendEmailMutation.isPending}
            className="text-xs font-semibold gap-1.5 cursor-pointer"
          >
            {sendEmailMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Send Newsletter
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tab Quick Links */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Link
          href="/assement/newsletter/subscribers"
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent transition-colors"
        >
          Subscribers List
        </Link>
        <Link
          href="/assement/newsletter/send-email"
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground border border-primary shadow-xs transition-colors"
        >
          Send Email
        </Link>
      </div>

      {/* Main Grid: Form vs Live Inbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-5">
          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
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
              placeholder="Enter email subject line..."
              disabled={sendEmailMutation.isPending}
              maxLength={150}
              className="text-xs py-2 px-3 bg-card border-border focus-visible:ring-primary/20"
              required
            />
          </div>

          {/* Recipient Emails */}
          <div className="space-y-1.5">
            <MultiEmailInput
              emails={emails}
              onChange={setEmails}
              disabled={sendEmailMutation.isPending}
              onFetchSystemUsers={() => refetchSystemUsers()}
              isLoadingSystemUsers={isLoadingSystemUsers}
              systemUsersList={systemUsersList}
            />
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              Email Body <span className="text-rose-500">*</span>
            </label>

            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Write your email body content here..."
              disabled={sendEmailMutation.isPending}
              minHeight="300px"
            />
          </div>

          {/* Action Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-border">
          

            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={sendEmailMutation.isPending}
              className="text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              Live Inbox Preview
            </h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
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
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Now
                </span>
              </div>

              {/* To field */}
              <div className="p-2 rounded-lg bg-muted/30 border border-border text-xs">
                <span className="text-[11px] text-muted-foreground font-medium">To: </span>
                {emails.length > 0 ? (
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

            {/* Email Rendered Content */}
            <div className="min-h-[200px] max-h-[360px] overflow-y-auto pr-1">
              {body ? (
                <div
                  className="prose dark:prose-invert max-w-none text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-1.5">
                  <Info className="w-6 h-6 mx-auto opacity-40 text-primary" />
                  <p className="text-xs">No email content typed yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground text-center">
              DECM Cluster Information System
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Confirm Send</h3>
                <p className="text-xs text-muted-foreground">Are you ready to send this email?</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/30 border border-border text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Subject:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">{subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Recipients:</span>
                <span className="font-semibold text-primary">{emails.length} address(es)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={sendEmailMutation.isPending}
                className="text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => sendEmailMutation.mutate()}
                disabled={sendEmailMutation.isPending}
                className="text-xs font-semibold gap-1.5 cursor-pointer"
              >
                {sendEmailMutation.isPending ? (
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
