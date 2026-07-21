"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth";
import Link from "next/link";

interface VerifyEmailClientProps {
  token: string;
}

export default function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided. Please check your email link.");
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err.message || "Failed to verify email. The link may have expired or is invalid.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl shadow-2xl rounded-3xl border border-border/50 p-8 text-center relative overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[300px] pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 z-10 relative"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Verifying Email</h2>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment while we verify your secure token...
                </p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 z-10 relative"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Email Verified!</h2>
                <p className="text-sm text-muted-foreground px-4">
                  Your email address has been successfully verified. You now have full access to your account.
                </p>
              </div>
              <Link href="/" className="w-full mt-4">
                <Button className="w-full rounded-xl h-11 text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer group">
                  Continue to Login
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 z-10 relative"
            >
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                <XCircle className="w-10 h-10 text-rose-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Verification Failed</h2>
                <p className="text-sm text-rose-500/90 font-medium px-4">
                  {errorMessage}
                </p>
              </div>
              <Link href="/contact" className="w-full mt-4">
                <Button variant="outline" className="w-full rounded-xl h-11 text-sm font-bold cursor-pointer">
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
