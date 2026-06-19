"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-reports";
import { siteConfig } from "@/config/site";

export default function ReportsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data: reports, isLoading, error } = useReports();

  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  const filteredReports = (reports || []).filter((rep) =>
    rep.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
            Situation Reports & Publications
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Download monthly sitreps and displacement trackers
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">
            Available Publications
          </h3>
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

        {isLoading ? (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-[72px]"
              >
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-8 bg-muted rounded w-28 shrink-0" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            Failed to load reports: {(error as Error).message}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    {rep.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Published: {formatDate(rep.created_at)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 cursor-pointer font-bold"
                  asChild
                >
                  <a href={getFileUrl(rep.file)} download={rep.name}>
                    Download PDF
                  </a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
            No reports match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
