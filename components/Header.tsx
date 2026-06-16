import React from "react";
import { Logo } from "@/components/ui/logo";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white border-b border-blue-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo className="w-14 h-14" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
                DECM Cluster Information Management
              </h1>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium flex items-center gap-1.5 mt-0.5">
                <span>Vanuatu</span>
                <span className="w-1 h-1 rounded-full bg-blue-400/50"></span>
                <span>NDMO, IOM & Cluster Partners</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-700/30 flex items-center gap-2 text-xs text-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Portal Database</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
