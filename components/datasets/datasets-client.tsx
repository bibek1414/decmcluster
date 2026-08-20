"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Database,
  FileText,
  FileSpreadsheet,
  Download,
  ExternalLink,
  BookOpen,
  Layers,
  Search,
  Copy,
  Check,
  ChevronRight,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Settings,
  FolderArchive,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useSops } from "@/hooks/use-sops";
import { useResponseTracking } from "@/hooks/use-response-tracking";
import { useReports } from "@/hooks/use-reports";
import { useAssessments } from "@/hooks/use-assessments";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

type CategoryFilter = "all" | "sops" | "response-tracking" | "reports" | "assessments";

export default function DatasetsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");

  // Data queries
  const { data: sopsData, isLoading: sopsLoading, error: sopsError } = useSops(1, debouncedSearch);
  const { data: responseTrackingData, isLoading: responseLoading, error: responseError } = useResponseTracking(debouncedSearch);
  const { data: reportsData, isLoading: reportsLoading, error: reportsError } = useReports(1, debouncedSearch);
  const { data: assessmentsData, isLoading: assessmentsLoading, error: assessmentsError } = useAssessments();

  // File URL helper
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Helper to extract file extension
  const getFileExtension = (filePath?: string | null): string => {
    if (!filePath) return "FILE";
    const clean = filePath.split("?")[0].split("#")[0];
    const parts = clean.split(".");
    if (parts.length < 2) return "FILE";
    return parts[parts.length - 1].toUpperCase();
  };

  // Date formatter
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Recent";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Copy link handler
  const handleCopyLink = (fileUrl: string, id: string) => {
    if (!fileUrl) {
      toast.error("No file URL available for this dataset.");
      return;
    }
    navigator.clipboard.writeText(fileUrl);
    setCopiedId(id);
    toast.success("Dataset link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Processed lists
  const sopsList = useMemo(() => sopsData?.results || [], [sopsData]);
  const responseList = useMemo(() => responseTrackingData || [], [responseTrackingData]);
  const reportsList = useMemo(() => reportsData?.results || [], [reportsData]);
  const assessmentsList = useMemo(() => {
    const all = assessmentsData || [];
    if (!debouncedSearch) return all;
    const query = debouncedSearch.toLowerCase();
    return all.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        (a.description && a.description.toLowerCase().includes(query))
    );
  }, [assessmentsData, debouncedSearch]);

  // Counts
  const totalSops = sopsData?.count ?? sopsList.length;
  const totalResponse = responseList.length;
  const totalReports = reportsData?.count ?? reportsList.length;
  const totalAssessments = assessmentsList.length;
  const totalDatasetsCount = totalSops + totalResponse + totalReports + totalAssessments;

  // Filter Categories
  const categories = [
    { id: "all" as const, label: "All Datasets", count: totalDatasetsCount, icon: Layers },
    { id: "sops" as const, label: "SOPs", count: totalSops, icon: BookOpen },
    {
      id: "response-tracking" as const,
      label: "Response Tracking",
      count: totalResponse,
      icon: FileSpreadsheet,
    },
    { id: "reports" as const, label: "Situation Reports", count: totalReports, icon: FileText },
    {
      id: "assessments" as const,
      label: "Assessment Forms",
      count: totalAssessments,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary flex items-center gap-2">
                Operational Datasets
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Central repository for all uploaded SOPs, response tracking tools, situation reports, and assessment files
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1.5 rounded-full">
              Total Datasets: <strong className="text-foreground font-extrabold">{totalDatasetsCount}</strong>
            </span>
          </div>
        </div>

        {/* 2. Overview Stats (Clean & Unified Primary Theme) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSelectedCategory("sops")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              selectedCategory === "sops"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 hover:bg-muted/60 border-border text-card-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-muted-foreground">SOP Documents</span>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground">{totalSops}</span>
            <div className="flex items-center gap-1 text-[11px] text-primary mt-1 font-semibold">
              <span>View files</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("response-tracking")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              selectedCategory === "response-tracking"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 hover:bg-muted/60 border-border text-card-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-muted-foreground">Response Tracking</span>
              <FileSpreadsheet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground">{totalResponse}</span>
            <div className="flex items-center gap-1 text-[11px] text-primary mt-1 font-semibold">
              <span>View files</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("reports")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              selectedCategory === "reports"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 hover:bg-muted/60 border-border text-card-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-muted-foreground">Situation Reports</span>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground">{totalReports}</span>
            <div className="flex items-center gap-1 text-[11px] text-primary mt-1 font-semibold">
              <span>View files</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("assessments")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              selectedCategory === "assessments"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/30 hover:bg-muted/60 border-border text-card-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-muted-foreground">Assessment Forms</span>
              <ClipboardList className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-foreground">{totalAssessments}</span>
            <div className="flex items-center gap-1 text-[11px] text-primary mt-1 font-semibold">
              <span>View files</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        </div>

        {/* 3. Search and Category Filters */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search datasets by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs sm:text-sm bg-background h-10 rounded-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Clean Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Unified List Format Content */}
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* SECTION A: STANDARD OPERATING PROCEDURES (SOPs)                           */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "sops") && (
          <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
                  Standard Operating Procedures (SOPs)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Official operational guidelines, role matrices, and disaster management templates
                </p>
              </div>

              <Link
                href="/sops"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors shrink-0 self-start sm:self-center"
              >
                <span>Go to SOPs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {sopsLoading ? (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between gap-4 h-16 bg-muted/20" />
                ))}
              </div>
            ) : sopsError ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                Failed to load SOP documents: {(sopsError as Error).message}
              </div>
            ) : sopsList.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No SOP documents found.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {sopsList.map((sop) => {
                  const fileUrl = getFileUrl(sop.file);
                  const format = getFileExtension(sop.file);
                  return (
                    <div
                      key={sop.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl border bg-primary/10 border-primary/20 text-primary mt-0.5 shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-foreground break-words">
                              {sop.name}
                            </h3>
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                              {format}
                            </span>
                          </div>
                          {sop.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
                              {sop.description}
                            </p>
                          )}
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            Updated: {formatDate(sop.updated_at || sop.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {sop.file ? (
                          <>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs font-bold shrink-0 cursor-pointer"
                            >
                              <a href={fileUrl} download className="flex items-center gap-1.5">
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            </Button>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary shrink-0 cursor-pointer"
                            >
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <span>Open</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(fileUrl, `sop-${sop.id}`)}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Copy Link"
                            >
                              {copiedId === `sop-${sop.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No file attached</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION B: RESPONSE TRACKING TOOLS & TEMPLATES                            */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "response-tracking") && (
          <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
                  Response Tracking Tools & Templates
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sector-wide 5W response matrices, reporting templates, and monitoring sheets
                </p>
              </div>

              <Link
                href="/response-tracking"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors shrink-0 self-start sm:self-center"
              >
                <span>Go to Response Tracking</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {responseLoading ? (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between gap-4 h-16 bg-muted/20" />
                ))}
              </div>
            ) : responseError ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                Failed to load response tracking data: {(responseError as Error).message}
              </div>
            ) : responseList.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No response tracking tools found.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {responseList.map((item) => {
                  const format = getFileExtension(item.file);
                  const fileUrl = getFileUrl(item.file);
                  return (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl border bg-primary/10 border-primary/20 text-primary mt-0.5 shrink-0">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-foreground break-words">
                              {item.name}
                            </h3>
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                              {format}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            Updated: {formatDate(item.updated_at || item.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {item.file ? (
                          <>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs font-bold shrink-0 cursor-pointer"
                            >
                              <a href={fileUrl} download className="flex items-center gap-1.5">
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            </Button>
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary shrink-0 cursor-pointer"
                            >
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <span>Open</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(fileUrl, `resp-${item.id}`)}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Copy Link"
                            >
                              {copiedId === `resp-${item.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No file available</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION C: SITUATION REPORTS & PUBLICATIONS                                */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "reports") && (
          <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
                  Situation Reports & Analytical Publications
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Monthly displacement sitreps, cyclone response analysis, and baseline publications
                </p>
              </div>

              <Link
                href="/reports"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors shrink-0 self-start sm:self-center"
              >
                <span>Go to Reports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {reportsLoading ? (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between gap-4 h-16 bg-muted/20" />
                ))}
              </div>
            ) : reportsError ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                Failed to load reports: {(reportsError as Error).message}
              </div>
            ) : reportsList.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No situation reports found.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {reportsList.map((rep) => {
                  const fileUrl = getFileUrl(rep.file);
                  const format = getFileExtension(rep.file);
                  return (
                    <div
                      key={rep.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl border bg-primary/10 border-primary/20 text-primary mt-0.5 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-foreground break-words">
                              {rep.name}
                            </h3>
                            {rep.type && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {rep.type}
                              </span>
                            )}
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                              {format}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            Published: {formatDate(rep.date || rep.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {rep.file && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            <a href={fileUrl} download className="flex items-center gap-1.5">
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </a>
                          </Button>
                        )}
                        {rep.file && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary shrink-0 cursor-pointer"
                          >
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <span>Open</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        )}
                        {rep.url && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            <a
                              href={rep.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Link</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {rep.file && (
                          <button
                            type="button"
                            onClick={() => handleCopyLink(fileUrl, `rep-${rep.id}`)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            title="Copy Link"
                          >
                            {copiedId === `rep-${rep.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION D: ASSESSMENT SCHEMAS & FIELD DATASETS                           */}
        {/* ========================================================================= */}
        {(selectedCategory === "all" || selectedCategory === "assessments") && (
          <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full inline-block"></span>
                  Assessment Schemas & Field Forms
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Evacuation centre master lists, DTM displacement schemas, and field assessment forms
                </p>
              </div>

              <Link
                href="/assessments-tools"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors shrink-0 self-start sm:self-center"
              >
                <span>Go to Assessments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assessmentsLoading ? (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between gap-4 h-16 bg-muted/20" />
                ))}
              </div>
            ) : assessmentsError ? (
              <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
                Failed to load assessment forms: {(assessmentsError as Error).message}
              </div>
            ) : assessmentsList.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No assessment schemas found.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                {assessmentsList.map((form) => {
                  const pdfUrl = getFileUrl(form.pdf);
                  const excelUrl = getFileUrl(form.excel);
                  return (
                    <div
                      key={form.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl border bg-primary/10 border-primary/20 text-primary mt-0.5 shrink-0">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-foreground break-words">
                              {form.name}
                            </h3>
                            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                              SCHEMA
                            </span>
                          </div>
                          {form.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
                              {form.description}
                            </p>
                          )}
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            Created: {formatDate(form.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                        {form.excel && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            <a href={excelUrl} download className="flex items-center gap-1.5">
                              <Download className="w-3.5 h-3.5" />
                              <span>Excel</span>
                            </a>
                          </Button>
                        )}
                        {form.pdf && (
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary shrink-0 cursor-pointer"
                          >
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <span>PDF Form</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        )}
                        {!form.excel && !form.pdf && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold text-primary shrink-0 cursor-pointer"
                          >
                            <Link href="/assessments-tools" className="flex items-center gap-1">
                              <span>Registry</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
