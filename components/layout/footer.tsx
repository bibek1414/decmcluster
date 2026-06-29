"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Mail, ArrowRight } from "lucide-react";

const VALID_PATHS = [
  "/",
  "/dashboard",
  "/mapping",
  "/assessments-tools",
  "/reports",
  "/sops",
  "/response-tracking",
  "/training",
  "/partners",
  "/links",
  "/contact"
];

export default function Footer() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/assement");
  const is404Path = pathname && !isAdminPath && !VALID_PATHS.includes(pathname);

  if (isAdminPath || is404Path) return null;
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <h4 className="text-sm font-bold text-foreground">
                DECM Cluster Vanuatu
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Supporting the Government of Vanuatu in coordinating displacement tracking, 
              evacuation center management, and multi-sector preparedness and response activities.
            </p>
          </div>

          {/* Column 2: Key Partners */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">
              Key Partners
            </h4>
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
            <h4 className="text-sm font-bold text-foreground">
              Contact & Support
            </h4>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                For system inquiries, data validation questions, or user account requests, 
                please reach out to the cluster coordinator.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="flex items-center gap-2 text-xs bg-muted/40 p-2.5 rounded-lg border border-border w-fit">
                  <Mail className="w-4 h-4 text-primary" />
                  <a 
                    href="mailto:coord@decmvanuatu.org" 
                    className="text-primary hover:underline font-semibold transition-colors duration-200"
                  >
                    coord@decmvanuatu.org
                  </a>
                </div>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors py-2.5 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 w-fit cursor-pointer"
                >
                  <span>Contact Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© 2026 DECM Cluster Vanuatu. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
            <a href="/contact" className="hover:text-foreground transition-colors duration-200 font-semibold">Contact Us</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Use</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Data Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
