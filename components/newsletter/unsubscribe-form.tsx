"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, UserX, Loader2, CheckCircle2, ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 animate-fadeIn">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        {/* Top Decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-rose-500" />

        {/* Brand & Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <Logo className="w-12 h-12" />
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              DECM Cluster Vanuatu
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Newsletter Unsubscribe
            </p>
          </div>
        </div>

        {isSuccess ? (
          /* Confirmation Screen */
          <div className="space-y-6 animate-scaleIn text-center py-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-bold text-foreground">You are unsubscribed</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The email address <span className="font-bold text-foreground">{unsubscribedEmail}</span> has been removed from our active newsletter distribution list.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResubscribe}
                disabled={subscribeMutation.isPending}
                className="w-full text-xs font-bold gap-1.5 h-10 border-primary/30 text-primary hover:bg-primary/5 cursor-pointer"
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

              <Button asChild variant="ghost" className="w-full text-xs font-bold gap-1.5 h-10 cursor-pointer">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4" /> Return to Home Page
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Unsubscribe Form */
          <form onSubmit={handleSubmit} className="space-y-5 pt-1">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-xs text-muted-foreground leading-relaxed">
                We&apos;re sorry to see you go. Enter your email address below to unsubscribe from receiving future displacement updates, situational reports, and announcements.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={unsubscribeMutation.isPending}
                className="h-10 text-xs bg-background"
              />
            </div>

            <Button
              type="submit"
              disabled={unsubscribeMutation.isPending}
              className="w-full h-10 text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-md"
            >
              {unsubscribeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unsubscribing...
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4" />
                  Unsubscribe Me
                </>
              )}
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to DECM Cluster
              </Link>
            </div>
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
        <div className="min-h-[500px] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
