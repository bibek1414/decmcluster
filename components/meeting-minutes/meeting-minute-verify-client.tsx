"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { meetingMinuteService } from "@/services/meeting-minute";
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Calendar,
  User,
  Eye,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import LoginCard from "@/components/auth/login-card";
import Link from "next/link";

interface Props {
  id: string;
}

export default function MeetingMinuteVerifyClient({ id }: Props) {
  const {
    user,
    isLoggedIn,
    isLoading: isAuthLoading,
    token,
    logout,
  } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<
    "verified" | "returned" | null
  >(null);
  const [commentText, setCommentText] = useState("");

  // Permissions
  const isSuperAdmin = user?.role === "Superadmin";
  const isViewer = user?.role === "Viewer";
  const canVerify = isSuperAdmin || (!isViewer && !!user?.role);

  // Fetch single meeting minute details
  const {
    data: item,
    isLoading: isDataLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["meeting-minute-detail", id, token],
    queryFn: () => meetingMinuteService.get(id, token),
    enabled: isLoggedIn && !!token,
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStatus) throw new Error("Please select a status action");
      return meetingMinuteService.verify(
        id,
        selectedStatus,
        commentText,
        token,
      );
    },
    onSuccess: (updated) => {
      toast.success(`Meeting minute successfully ${selectedStatus}!`);
      setCommentText("");
      setSelectedStatus(null);
      queryClient.invalidateQueries({
        queryKey: ["meeting-minute-detail", id],
      });
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update verification status");
    },
  });

  // Reverify mutation
  const reverifyMutation = useMutation({
    mutationFn: async () => {
      return meetingMinuteService.reverify(id, token);
    },
    onSuccess: () => {
      toast.success("Meeting minute reverted to unverified status!");
      queryClient.invalidateQueries({
        queryKey: ["meeting-minute-detail", id],
      });
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reverify meeting minute");
    },
  });

  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate();
  };

  // State 1: Auth Loading
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-16 animate-fadeIn">
        <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-2xl shadow-sm">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-xs text-muted-foreground font-semibold">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // State 2: User not logged in -> Prompt login
  if (!isLoggedIn) {
    return (
      <div className="max-w-md w-full mx-auto px-4 py-16 animate-fadeIn space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-extrabold text-foreground">
            Secure Verification
          </h2>
          <p className="text-xs text-muted-foreground">
            Please log in with an authorized account to verify and review
            coordination meeting minutes.
          </p>
        </div>
        <LoginCard />
      </div>
    );
  }

  // State 3: User is logged in but has no permission (e.g. Viewer)
  if (!canVerify) {
    return (
      <div className="max-w-md w-full mx-auto px-4 py-16 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-6 shadow-sm">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/20">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">
              Access Denied
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your account <strong>{user?.email}</strong> does not have
              permission to verify meeting minutes. Please request verification
              rights from the administrator.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              asChild
              variant="outline"
              className="w-full h-10 font-bold cursor-pointer"
            >
              <Link href="/">Go to Homepage</Link>
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full h-10 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold cursor-pointer"
            >
              Sign Out & Switch Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Data Loading
  if (isDataLoading) {
    return (
      <div className="max-w-3xl w-full mx-auto px-4 py-16 animate-fadeIn space-y-4">
        <div className="h-8 bg-muted rounded-lg w-1/3 animate-pulse" />
        <div className="h-48 bg-muted rounded-2xl w-full animate-pulse" />
      </div>
    );
  }

  // State 5: Fetch Error
  if (error || !item) {
    return (
      <div className="max-w-3xl w-full mx-auto px-4 py-16 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
          <h3 className="text-base font-bold text-foreground">
            Failed to Load Document
          </h3>
          <p className="text-xs text-muted-foreground">
            {(error as Error)?.message ||
              "The requested meeting minute could not be retrieved. It may have been deleted."}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="cursor-pointer font-bold"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 animate-fadeIn space-y-6">
      {/* Back button / Navigation Context */}
      <div className="flex items-center justify-between">
        <Link
          href="/assement/meeting-minutes"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Meeting Minutes
        </Link>
        <span className="text-[10px] text-muted-foreground font-bold  tracking-wider bg-muted border border-border px-2.5 py-1 rounded-full">
          Verification Portal
        </span>
      </div>

      {/* Main Document Details Card */}
      <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border  space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1.5">
            <h1 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                {formattedDate}
              </span>
              {item.uploaded_by && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                  Uploaded by: {item.uploaded_by.email}
                </span>
              )}
            </div>
          </div>

          <div>
            {item.status === "verified" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            ) : item.status === "returned" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" /> Returned
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                <Clock className="w-3.5 h-3.5" /> Unverified
              </span>
            )}
          </div>
        </div>

        {/* File Download / View Link Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border hover:bg-muted/65 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate max-w-sm sm:max-w-md">
                {item.file ? item.file.split("/").pop() : "document_file"}
              </p>
              <p className="text-[10px] text-muted-foreground font-semibold ">
                Attachment File
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getFileUrl(item.file), "_blank")}
            className="font-bold cursor-pointer gap-1.5 h-9"
          >
            <Eye className="w-4 h-4" /> View File
          </Button>
        </div>

        {/* Verification Form Section */}
        {item.status === "unverified" || item.status === "returned" ? (
          <form onSubmit={handleVerifySubmit} className="pt-2 space-y-5">
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-muted-foreground  tracking-wider">
                Select Verification Decision
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("verified")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === "verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm ring-1 ring-emerald-500"
                      : "bg-background text-foreground border-border hover:bg-muted/30"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${selectedStatus === "verified" ? "text-emerald-600" : "text-muted-foreground"}`}
                  />
                  Verify Document
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("returned")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === "returned"
                      ? "bg-rose-50 text-rose-700 border-rose-500 shadow-sm ring-1 ring-rose-500"
                      : "bg-background text-foreground border-border hover:bg-muted/30"
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 ${selectedStatus === "returned" ? "text-rose-600" : "text-muted-foreground"}`}
                  />
                  Return Document
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-muted-foreground  tracking-wider">
                Comments / Feedback
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  selectedStatus === "returned"
                    ? "Specify the reasons for returning this document (required)..."
                    : "Add optional verification comments or notes..."
                }
                rows={4}
                className="w-full p-3 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/70"
                required={selectedStatus === "returned"}
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="submit"
                disabled={
                  !selectedStatus ||
                  verifyMutation.isPending ||
                  (selectedStatus === "returned" && !commentText.trim())
                }
                className="h-10 px-6 font-bold cursor-pointer"
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Decision"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-2 border-t border-border space-y-6">
            {/* Decided Outcome Card */}
            <div
              className={`p-4 rounded-xl border ${
                item.status === "verified"
                  ? "bg-emerald-50/40 border-emerald-100/80 text-emerald-800"
                  : "bg-rose-50/40 border-rose-100/80 text-rose-800"
              }`}
            >
              <p className="text-xs font-bold flex items-center gap-1.5">
                {item.status === "verified" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified by {item.verified_by?.email || "Admin"}
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Returned by {item.verified_by?.email || "Admin"}
                  </>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground font-semibold mt-1">
                Decision submitted on{" "}
                {item.updated_at
                  ? new Date(item.updated_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            {/* Comment Log */}
            {item.comments && item.comments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground  tracking-wider">
                  Comment Log
                </h4>
                <div className="space-y-2.5">
                  {(item.comments as any[]).map((commentVal, index) => {
                    const isStr = typeof commentVal === "string";
                    const text = isStr
                      ? commentVal
                      : commentVal.comment || commentVal.text || "";
                    const author = isStr ? null : commentVal.user?.email;
                    const date = isStr ? null : commentVal.created_at;

                    return (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl bg-muted/30 border border-border/70 text-xs"
                      >
                        <p className="text-foreground leading-relaxed font-medium">
                          {text}
                        </p>
                        {(author || date) && (
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-semibold">
                            {author && <span>By: {author}</span>}
                            {author && date && <span>•</span>}
                            {date && (
                              <span>{new Date(date).toLocaleString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reverify Option */}
            {item.status === "returned" && (
              <div className="border-t border-border pt-5 flex items-center justify-between">
                <div className="text-xs text-muted-foreground font-medium">
                  Need to change the status or request review again?
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reverifyMutation.mutate()}
                  disabled={reverifyMutation.isPending}
                  className="font-bold cursor-pointer gap-1.5 h-9"
                >
                  {reverifyMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  Reverify Document
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
