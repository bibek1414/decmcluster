"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Eye, EyeOff, Lock, ChevronRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import Link from "next/link";

interface VerifyEmailClientProps {
  token: string;
}

export default function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState<"form" | "verifying" | "success" | "error">(
    token ? "form" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token provided. Please check your email link."
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please check and try again.");
      return;
    }

    setStatus("verifying");

    try {
      await authService.verifyEmail(token, password);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to verify email. The link may have expired or is invalid.");
    }
  };

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
          {status === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 z-10 relative text-left"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 self-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-1 text-center w-full">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Verify & Set Password
                </h2>
                <p className="text-xs text-muted-foreground">
                  Please choose a password for your account to complete registration.
                </p>
              </div>

              {errorMessage && (
                <div className="w-full p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center animate-fadeIn">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background pr-10 rounded-xl h-11 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background pr-10 rounded-xl h-11 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl h-11 text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer mt-2"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Verify Email & Save Password
                </Button>
              </form>
            </motion.div>
          )}

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
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Verifying Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we verify your email and set up your password...
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
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Email Verified!
                </h2>
                <p className="text-sm text-muted-foreground px-4">
                  Your email address has been successfully verified and your password has been created.
                </p>
              </div>
              <Link href="/" className="w-full mt-4">
                <Button className="w-full rounded-xl h-11 text-sm font-bold shadow-lg shadow-primary/20 cursor-pointer group">
                  Continue to Login
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Verification Failed
                </h2>
                <p className="text-sm text-rose-500/90 font-medium px-4">
                  {errorMessage}
                </p>
              </div>
              <div className="w-full space-y-2 mt-4">
                {token && (
                  <Button
                    onClick={() => setStatus("form")}
                    className="w-full rounded-xl h-11 text-sm font-bold cursor-pointer"
                  >
                    Try Again
                  </Button>
                )}
                <Link href="/contact" className="w-full block">
                  <Button variant="outline" className="w-full rounded-xl h-11 text-sm font-bold cursor-pointer">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

