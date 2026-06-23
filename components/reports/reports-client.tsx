"use client";

import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-reports";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";
import { Pagination } from "@/components/shared/pagination";

export default function ReportsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset to first page when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data, isLoading, isPlaceholderData, error } = useReports(
    page,
    debouncedSearch,
  );

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

  const reportsList = data?.results || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
        {data && (
          <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
            Total Publications:{" "}
            <strong className="text-foreground font-extrabold">
              {data.count}
            </strong>
          </span>
        )}
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

        <div className="relative">
          {/* Active page change loading overlay */}
          {isPlaceholderData && (
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity animate-fadeIn">
              <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-foreground">
                  Updating...
                </span>
              </div>
            </div>
          )}

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
          ) : reportsList.length > 0 ? (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="divide-y divide-border">
                {reportsList.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {rep.name}
                        </h4>
                        {rep.type && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white border border-primary">
                            {rep.type}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Published: {rep.date || formatDate(rep.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {rep.file && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer font-bold flex items-center gap-1.5"
                          asChild
                        >
                          <a href={getFileUrl(rep.file)} download={rep.name}>
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                          </a>
                        </Button>
                      )}
                      {rep.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer font-bold flex items-center gap-1.5"
                          asChild
                        >
                          <a
                            href={rep.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open Link
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reusable Pagination footer */}
              {data && (data.previous || data.next) && (
                <Pagination
                  currentPage={page}
                  hasPrevious={!!data.previous}
                  hasNext={!!data.next}
                  onPageChange={(p) => setPage(p)}
                  isPlaceholderData={isPlaceholderData}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
              No reports match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
