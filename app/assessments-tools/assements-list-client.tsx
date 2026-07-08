"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import { useAssessments } from "@/hooks/use-assessments";
import { siteConfig } from "@/config/site";
import { EmptyState } from "@/components/shared/empty-state";

export default function AssessmentsListClient() {
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data: assessments, isLoading, error } = useAssessments();

  const publicAssessments = React.useMemo(() => {
    return assessments?.filter((form) => form.is_public) || [];
  }, [assessments]);

  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  if (isLoading) {
    return (
      <div className="border-0 sm:border border-border rounded-none sm:rounded-xl p-0 sm:p-5 bg-transparent sm:bg-muted/30 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground font-extrabold">
          Downloadable Assessment Forms
        </h3>
        <p className="text-xs text-muted-foreground">
          Loading downloadable DECM Cluster assessment forms...
        </p>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-card border border-border flex items-center justify-between h-11"
            >
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="flex gap-3">
                <div className="h-3.5 bg-muted rounded w-16" />
                <div className="h-3.5 bg-muted rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-0 sm:border border-border rounded-none sm:rounded-xl p-0 sm:p-5 bg-transparent sm:bg-muted/30 space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground font-extrabold">
          Downloadable Assessment Forms
        </h3>
        <div className="p-4 rounded-lg border border-red-200/50 bg-red-50/50 text-red-700 text-xs font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
          Failed to load assessment forms: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="border-0 sm:border border-border rounded-none sm:rounded-xl p-0 sm:p-5 bg-transparent sm:bg-muted/30 space-y-4">
      <h3 className="text-xs font-bold text-muted-foreground font-extrabold">
        Downloadable Assessment Forms
      </h3>
      <p className="text-xs text-muted-foreground">
        Download the official DECM Cluster assessment forms in PDF or Excel format
        for offline use and field surveys.
      </p>

      {publicAssessments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assessments available"
          description="There are currently no assessment forms published. Check back later."
        />
      ) : (
        <div className="space-y-2">
          {publicAssessments.map((form) => (
            <div
              key={form.id}
              className="p-3 rounded-lg bg-card border border-border flex items-center justify-between text-xs font-bold text-card-foreground hover:border-foreground/10 transition-colors"
            >
              <div className="truncate mr-2 min-w-0">
                <span className="truncate block font-bold text-foreground">{form.name}</span>
                {form.description && form.description.trim() !== "" && (
                  <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">
                    {form.description}
                  </span>
                )}
              </div>
              <div className="flex gap-3 shrink-0 items-center">
                {form.excel && (
                  <a
                    href={getFileUrl(form.excel)}
                    download
                    className="text-[10px] text-green-600 hover:underline font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    Download Excel
                  </a>
                )}
                {form.pdf && (
                  <a
                    href={getFileUrl(form.pdf)}
                    download
                    className="text-[10px] text-primary hover:underline font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
