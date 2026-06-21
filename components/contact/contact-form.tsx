"use client";

import React, { useState } from "react";
import { Mail, Phone, User, Send, CheckCircle2 } from "lucide-react";
import { useContactMutation } from "@/hooks/use-contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submitMutation = useContactMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }
    if (!message.trim()) {
      toast.error("Message is required.");
      return;
    }

    submitMutation.mutate(
      {
        full_name: fullName,
        email: email.trim() || undefined,
        phone: phone,
        message: message,
      },
      {
        onSuccess: () => {
          toast.success("Thank you! Your message has been sent successfully.");
          setFullName("");
          setEmail("");
          setPhone("");
          setMessage("");
        },
        onError: (err) => {
          toast.error(err.message || "An error occurred. Please try again.");
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto text-card-foreground sm:rounded-2xl border border-border p-6 md:p-10 -lg space-y-6 mt-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
          Send Us a Message
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Have questions or feedback about the DECM Cluster Information System?
          Fill out the form below and we will get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" /> Full Name{" "}
            <span className="text-rose-500">*</span>
          </label>
          <Input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Doe"
            disabled={submitMutation.isPending}
            className="bg-background h-10 text-xs w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              disabled={submitMutation.isPending}
              className="bg-background h-10 text-xs w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Phone Number{" "}
              <span className="text-rose-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              required
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +678 7712345"
              disabled={submitMutation.isPending}
              className="bg-background h-10 text-xs w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="text-xs font-bold text-muted-foreground"
          >
            Your Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your comments or questions here..."
            disabled={submitMutation.isPending}
            className="w-full rounded-xl border border-input bg-background p-3.5 text-xs text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full h-10 font-bold cursor-pointer flex items-center justify-center gap-2"
          >
            {submitMutation.isPending ? (
              <>Sending Message...</>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </Button>
        </div>
      </form>

      {submitMutation.isSuccess && (
        <div className="p-3 bg-green-50/50 border border-green-200/50 text-green-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn dark:bg-green-950/10 dark:border-green-900/30 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>
            Your query has been recorded. Our team will review and contact you
            shortly.
          </span>
        </div>
      )}
    </div>
  );
}
