"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Settings,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSops } from "@/hooks/use-sops";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";
import { Pagination } from "@/components/shared/pagination";

export default function SopsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset to first page when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data, isLoading, isPlaceholderData, error } = useSops(
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

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (
      lower.includes("collection") ||
      lower.includes("survey") ||
      lower.includes("form")
    )
      return ClipboardList;
    if (
      lower.includes("validation") ||
      lower.includes("workflow") ||
      lower.includes("approval") ||
      lower.includes("check")
    )
      return ShieldCheck;
    if (
      lower.includes("role") ||
      lower.includes("setting") ||
      lower.includes("management")
    )
      return Settings;
    return BookOpen;
  };

  const sopsList = data?.results || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Standard Operating Procedures
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Core operating guidelines and disaster management templates
            </p>
          </div>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
            Total SOPs:{" "}
            <strong className="text-foreground font-extrabold">
              {data.count}
            </strong>
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">
            Available Documents
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search SOPs..."
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
              <div className="bg-card border border-border px-3 py-1.5 rounded-lg -sm flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-foreground">
                  Updating...
                </span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border bg-card space-y-4 h-[180px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load SOP documents: {(error as Error).message}
            </div>
          ) : sopsList.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sopsList.map((sop) => {
                  const Icon = getIcon(sop.name);
                  return (
                    <div
                      key={sop.id}
                      className="p-5 rounded-xl border border-border  flex flex-col justify-between gap-4  transition-all duration-200 -sm"
                    >
                      <div>
                        <div className="p-2.5 rounded-lg bg-card border border-border w-fit mb-3 text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-foreground">
                          {sop.name}
                        </h3>
                        {sop.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                            {sop.description}
                          </p>
                        )}
                      </div>
                      {sop.file && (
                        <a
                          href={getFileUrl(sop.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-extrabold hover:underline text-left cursor-pointer inline-flex items-center gap-1 w-fit"
                        >
                          Read SOP Document <ChevronRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reusable Pagination */}
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
              No SOP documents match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
