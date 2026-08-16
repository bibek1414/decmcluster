"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, UserX, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { useUnsubscribeNewsletter, useSubscribeNewsletter } from "@/hooks/use-newsletter";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [isSuccess, setIsSuccess] = useState(false);
  const [unsubscribedEmail, setUnsubscribedEmail] = useState("");

  const unsubscribeMutation = useUnsubscribeNewsletter();
  const subscribeMutation = useSubscribeNewsletter();

  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    unsubscribeMutation.mutate(cleanEmail, {
      onSuccess: () => {
        setUnsubscribedEmail(cleanEmail);
        setIsSuccess(true);
        toast.success("Successfully unsubscribed from DECM Cluster newsletter.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to unsubscribe. Please try again.");
      },
    });
  };

  const handleResubscribe = () => {
    if (!unsubscribedEmail) return;

    subscribeMutation.mutate(unsubscribedEmail, {
      onSuccess: () => {
        setIsSuccess(false);
        toast.success("Welcome back! You have resubscribed to DECM Cluster updates.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to resubscribe.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background text-foreground animate-fadeIn">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo className="w-12 h-12" />
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              DECM Cluster Vanuatu
            </h1>
            <p className="text-xs font-semibold text-muted-foreground">
              Newsletter Unsubscribe
            </p>
          </div>
        </div>

        {isSuccess ? (
          /* Confirmation Screen */
          <div className="space-y-5 animate-scaleIn text-center py-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-foreground">You have unsubscribed</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The email address <span className="font-bold text-foreground">{unsubscribedEmail}</span> will no longer receive newsletter updates from DECM Cluster.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleResubscribe}
                disabled={subscribeMutation.isPending}
                className="w-full text-xs font-bold gap-1.5 h-10 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer shadow-none"
              >
                {subscribeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resubscribing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Changed your mind? Resubscribe
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Unsubscribe Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-muted-foreground leading-relaxed text-center">
              Enter your email address below to unsubscribe from receiving future newsletter updates.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Email address</span>
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={unsubscribeMutation.isPending}
                className="h-10 text-xs bg-background shadow-none"
              />
            </div>

            <Button
              type="submit"
              disabled={unsubscribeMutation.isPending}
              className="w-full h-10 text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-none"
            >
              {unsubscribeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unsubscribing...
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  Unsubscribe
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribeForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
