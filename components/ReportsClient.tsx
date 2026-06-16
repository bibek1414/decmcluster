"use client";

import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ReportsClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const reportsList = [
    { title: "DECM Monthly Displacement Situation Report (June 2026)", size: "2.4 MB", date: "June 12, 2026" },
    { title: "Vanuatu Evacuation Centre Audit & Wash Quality Index (Q2)", size: "4.8 MB", date: "May 28, 2026" },
    { title: "TC Harold Displacement Longitudinal Study - 6 Years On", size: "12.1 MB", date: "April 15, 2026" },
    { title: "Standardized Shelter Kit Distribution Audit Summary", size: "1.1 MB", date: "March 02, 2026" }
  ];

  const filteredReports = reportsList.filter(rep =>
    rep.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Situation Reports & Publications</h2>
          <p className="text-xs text-muted-foreground mt-1">Download monthly sitreps and displacement trackers</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Publications</h3>
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs max-w-sm w-full sm:w-60 bg-background"
            />
          </div>
        </div>

        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
          {filteredReports.length > 0 ? (
            filteredReports.map((rep, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{rep.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Published: {rep.date} | Size: {rep.size}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 cursor-pointer">
                  Download PDF
                </Button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No reports match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
