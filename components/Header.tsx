import React from "react";
import { Logo } from "@/components/ui/logo";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo className="w-14 h-14" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                DECM Cluster Information Management
              </h1>
              <p className="text-xs sm:text-sm text-primary-foreground/85 font-medium flex items-center gap-1.5 mt-0.5">
                <span>Vanuatu</span>
                <span className="w-1 h-1 rounded-full bg-primary-foreground/35"></span>
                <span>NDMO, IOM & Cluster Partners</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/25 flex items-center gap-2 text-xs text-primary-foreground/90">
              <span>Live Portal Database</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
