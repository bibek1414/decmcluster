"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Download,
  FileSpreadsheet,
  FileText,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResponseTrackingClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const trackingList = [
    {
      title: "5w Reporting Templates",
      format: "XLSX",
      size: "61 KB",
      date: "June 18, 2026",
      path: "/response-tracking/Response%20Tracking%20Tool%205W%20DECM%20Cluster.xlsx",
      isAvailable: true,
    },
    {
      title: "Situation Report Templates",
      format: "PPTX",
      size: "4.8 MB",
      date: "June 12, 2026",
      path: "/response-tracking/Displacement-Evacuation-Center-Management-DECM-Cluster%20Sitrep%20Template.pptx",
      isAvailable: true,
    },
    {
      title: "5W Response data",
      format: "XLSX",
      size: "60 KB",
      date: "June 12, 2026",
      path: "/response-tracking/Response%20Tracking%20Tool%205W%20DECM%20Cluster.xlsx",
      isAvailable: true,
    },
  ];

  const getFormatIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case "XLSX":
        return FileSpreadsheet;
      case "PPTX":
        return BarChart3;
      default:
        return FileText;
    }
  };

  const filteredList = trackingList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Response Tracking</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Sector-wide reporting templates and field response data
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">Available Templates & Tools</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs max-w-sm w-full sm:w-60 bg-background"
            />
          </div>
        </div>

        <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
          {filteredList.length > 0 ? (
            filteredList.map((item, idx) => {
              const Icon = getFormatIcon(item.format);
              return (
                <div
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={item.isAvailable
                        ? "p-2.5 rounded-xl border mt-0.5 bg-primary/10 border-primary/20 text-primary"
                        : "p-2.5 rounded-xl border mt-0.5 bg-muted border-border text-muted-foreground"
                      }
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {item.isAvailable
                          ? `Updated: ${item.date} | Size: ${item.size}`
                          : `Status: TBA`}
                      </p>
                    </div>
                  </div>
                  {item.isAvailable ? (
                    <Button asChild variant="outline" size="sm" className="shrink-0 cursor-pointer">
                      <a href={item.path} download className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Download {item.format}
                      </a>
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled className="shrink-0 text-[10px] italic">
                      TBA
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs">
              No templates or tracking tools match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
