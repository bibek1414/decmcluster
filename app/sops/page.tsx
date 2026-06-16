import React from "react";
import { BookOpen, ClipboardList, ShieldCheck, Settings, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOPs & Guidelines — DECM Cluster Vanuatu",
  description: "Core operating guidelines, role matrix, and disaster management templates.",
};

export default function SopsPage() {
  const sopsList = [
    { title: "Data Collection SOP", icon: ClipboardList, desc: "Step-by-step instructions on field validation and mobile data entry for enumerators." },
    { title: "Validation Workflows", icon: ShieldCheck, desc: "Protocol for provincial cluster officers to check and authorize village data submissions." },
    { title: "Role Management Settings", icon: Settings, desc: "Permissions matrix regarding who can view, edit or export spatial database points." }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Standard Operating Procedures</h2>
            <p className="text-xs text-muted-foreground mt-1">Core operating guidelines and disaster management templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sopsList.map((sop, idx) => {
            const Icon = sop.icon;
            return (
              <div key={idx} className="p-5 rounded-xl border border-border bg-card hover:bg-muted/40 flex flex-col justify-between gap-4">
                <div>
                  <div className="p-2.5 rounded-lg bg-card border border-border w-fit mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{sop.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">{sop.desc}</p>
                </div>
                <button className="text-xs text-primary font-extrabold hover:underline text-left cursor-pointer inline-flex items-center gap-1">
                  Read SOP Document <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
