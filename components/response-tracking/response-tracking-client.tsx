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
import { useResponseTracking } from "@/hooks/use-response-tracking";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";

export default function ResponseTrackingClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data: trackingList, isLoading, error } = useResponseTracking(debouncedSearch);

  const getFileExtension = (urlPath: string): string => {
    if (!urlPath) return "FILE";
    const parts = urlPath.split(".");
    const ext = parts[parts.length - 1];
    if (!ext) return "FILE";
    const cleanExt = ext.split(/[?#]/)[0].toUpperCase();
    return cleanExt;
  };

  const getFormatIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case "XLS":
      case "XLSX":
        return FileSpreadsheet;
      case "PPT":
      case "PPTX":
        return BarChart3;
      default:
        return FileText;
    }
  };

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

  const items = trackingList || [];

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
            Failed to load response tracking data: {(error as Error).message}
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
            {items.map((item) => {
              const format = getFileExtension(item.file);
              const Icon = getFormatIcon(format);
              return (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl border mt-0.5 bg-primary/10 border-primary/20 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Updated: {formatDate(item.updated_at)}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0 cursor-pointer font-bold">
                    <a href={getFileUrl(item.file)} download className="flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Download {format}
                    </a>
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
            No templates or tracking tools match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
