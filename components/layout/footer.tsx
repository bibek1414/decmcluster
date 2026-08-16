"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Mail, ChevronRight, Loader2, Send, CheckCircle2 } from "lucide-react";
import { useSubscribeNewsletter } from "@/hooks/use-newsletter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    subscribeMutation.mutate(cleanEmail, {
      onSuccess: () => {
        setSubscribed(true);
        setEmail("");
        toast.success("Successfully subscribed to DECM Cluster newsletter updates!");
      },
      onError: (err: any) => {
        const errorMsg = err.message || "Failed to subscribe. Please try again.";
        toast.error(errorMsg);
      },
    });
  };

  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12 space-y-12">
        {/* Newsletter Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-muted border border-primary/20 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20">
                <Mail className="w-3.5 h-3.5" />
                <span>Stay Informed</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                Subscribe to DECM Cluster Updates
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Subscribe to receive the latest displacement updates, situational reports, and
                emergency preparedness announcements directly in your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto min-w-[320px] sm:min-w-[400px]">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribed) setSubscribed(false);
                    }}
                    placeholder="Enter your email address..."
                    className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-xs font-semibold placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="h-11 px-5 w-full sm:w-auto font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow-md"
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : subscribed ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-300" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-3.5 w-3.5" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <h4 className="text-sm font-bold text-foreground">DECM Cluster Vanuatu</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Supporting the Government of Vanuatu in coordinating displacement tracking, evacuation
              center management, and multi-sector preparedness and response activities.
            </p>
          </div>

          {/* Column 2: Key Partners */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">Key Partners</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/45"></span>
                <span>National Disaster Management Office (NDMO)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/45"></span>
                <span>International Organization for Migration (IOM)</span>
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/45"></span>
                <span>DECM Cluster Partner Organizations</span>
              </li>
              <li className="flex items-center gap-2 hover:text-foreground transition-colors duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/45"></span>
                <span>Provincial Emergency Operations Centers (PEOC)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">Contact & Support</h4>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                For system inquiries, data validation questions, or user account requests, please
                reach out to the cluster coordinator.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex items-center gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border w-fit">
                  <Mail className="w-4 h-4 text-primary" />
                  <a
                    href="mailto: info@decmcluster.org"
                    className="text-primary hover:underline font-semibold transition-colors duration-200"
                  >
                    info@decmcluster.org
                  </a>
                </div>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors py-2.5 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 w-fit cursor-pointer"
                >
                  <span>Contact Form</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© 2026 DECM Cluster Vanuatu. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
            <a
              href="/contact"
              className="hover:text-foreground transition-colors duration-200 font-semibold"
            >
              Contact Us
            </a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">
              Terms of Use
            </a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">
              Data Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

