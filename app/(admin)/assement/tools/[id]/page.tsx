"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useAssessment, useAssessmentResults } from "@/hooks/use-assessments";
import { siteConfig } from "@/config/site";

export default function ToolDetailPage() {
  const params = useParams();
  const { token } = useAuth();

  const slug = params.id as string;

  // Base URL translation
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Queries
  const {
    data: assessment,
    isLoading: isAssessmentLoading,
    error: assessmentError,
  } = useAssessment(slug);

  const {
    data: results = [],
    isLoading: isResultsLoading,
    error: resultsError,
  } = useAssessmentResults(slug, token);

  if (isAssessmentLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-card border border-border rounded-2xl shadow-sm p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold mt-4">
            Loading tool details...
          </p>
        </div>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            Tool Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The tool with slug{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
              {slug}
            </code>{" "}
            may have been deleted, moved, or the API is unreachable.
          </p>
          <Button asChild className="mt-2 font-bold cursor-pointer">
            <Link href="/assement/tools">Back to tools</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <Link
          href="/assement/tools"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All tools
        </Link>

        <PageHeader
          title={assessment.name}
          description={assessment.description || undefined}
        />

        <div className="space-y-6">
          {/* Main panel: List of uploaded result datasets (View Only) */}
          <Card className="p-5 border border-border bg-card space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Uploaded Assessment Results / Reports (Read-Only)
              </h3>
            </div>

            {isResultsLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-xl w-full" />
                ))}
              </div>
            ) : resultsError ? (
              <div className="p-4 border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-semibold">
                Failed to load results: {(resultsError as Error).message}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">
                  No results uploaded yet
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  No reports or findings have been uploaded for this assessment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => {
                  const resultDate = result.created_at
                    ? new Date(result.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A";

                  return (
                    <div
                      key={result.id}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-foreground/10 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground truncate block">
                            {result.title}
                          </span>
                          <span className="text-[9px] text-muted-foreground whitespace-nowrap bg-muted/60 px-1.5 py-0.5 rounded font-semibold">
                            {resultDate}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {result.file && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-bold gap-1 cursor-pointer"
                            asChild
                          >
                            <a
                              href={getFileUrl(result.file)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-3.5 h-3.5" /> Download File
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
