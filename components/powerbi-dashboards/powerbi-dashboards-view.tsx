"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI, usePowerBIDetail } from "@/hooks/use-powerbi";

interface PowerBIDashboardsViewProps {
  reportId?: number;
}

export function PowerBIDashboardsView({ reportId }: PowerBIDashboardsViewProps) {
  const { token } = useAuth();
  const { data: apiData = [], isLoading } = usePowerBI(token);

  // Available reports from API only
  const reports = useMemo(() => {
    return apiData && apiData.length > 0 ? apiData : [];
  }, [apiData]);

  // Selected report ID state
  const [selectedId, setSelectedId] = useState<number | null>(reportId || null);

  // Sync selectedId when reports or reportId prop changes
  useEffect(() => {
    if (reportId) {
      setSelectedId(reportId);
    } else if (reports.length > 0 && selectedId === null) {
      setSelectedId(reports[0].id);
    }
  }, [reportId, reports, selectedId]);

  // Single report detail from API (GET /api/dashboard/powerbi-iframe/${id}/)
  const { data: singleDetail, isLoading: isSingleLoading } = usePowerBIDetail(selectedId, token);

  // Active report object
  const activeReport = useMemo(() => {
    if (singleDetail) return singleDetail;
    return reports.find((r) => r.id === selectedId) || reports[0] || null;
  }, [singleDetail, reports, selectedId]);

  // Full-page skeleton while loading
  const showSkeleton = isLoading || (isSingleLoading && !activeReport?.iframe_link);

  return (
    <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20">
      {/* Hero Header */}
      <section className="bg-primary py-8 sm:py-12 lg:py-16 relative overflow-hidden select-none ">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 sm:gap-2 text-xs text-primary-foreground/80 mb-4 sm:mb-6 font-medium flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-primary-foreground transition-colors flex items-center gap-1"
            >
              Home
            </Link>
            {showSkeleton ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/40 shrink-0" />
                <div className="h-3.5 w-28 bg-primary-foreground/20 rounded-full animate-pulse" />
              </>
            ) : activeReport ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60 shrink-0" />
                <span className="text-primary-foreground font-semibold truncate max-w-[200px]">
                  {activeReport.name}
                </span>
              </>
            ) : null}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {showSkeleton ? (
                <>
                  <div className="h-6 w-48 bg-primary-foreground/20 rounded-full animate-pulse" />
                  <div className="h-10 w-3/4 bg-primary-foreground/20 rounded-xl animate-pulse" />
                  <div className="h-4 w-full max-w-md bg-primary-foreground/15 rounded-full animate-pulse" />
                  <div className="h-4 w-2/3 max-w-sm bg-primary-foreground/10 rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 max-w-full text-wrap leading-tight">
                    PowerBI Analytics &amp; Interactive Dashboards
                  </span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                    {activeReport?.name || "PowerBI Dashboards"}
                  </h1>
                  <p className="text-sm sm:text-lg text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
                    Interactive real-time visualization reports, spatial analytics and operational
                    statistics for Vanuatu DECM Cluster.
                  </p>
                </>
              )}
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              {showSkeleton ? (
                <>
                  <div className="h-3 w-20 bg-primary-foreground/20 rounded-full animate-pulse mb-2" />
                  <div className="h-3 w-full bg-primary-foreground/15 rounded-full animate-pulse" />
                  <div className="h-3 w-5/6 bg-primary-foreground/15 rounded-full animate-pulse" />
                  <div className="h-3 w-4/6 bg-primary-foreground/10 rounded-full animate-pulse" />
                </>
              ) : (
                <>
                  <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                    Page Purpose
                  </strong>
                  <p className="text-xs text-primary-foreground/90 leading-relaxed">
                    This page provides interactive data analytics, spatial visualizations and
                    cluster metrics powered by Microsoft PowerBI. Data is updated in real time.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
        <div className="bg-card border border-border rounded-2xl overflow-hidden space-y-0">
          {/* Card header */}
          <div className="bg-card text-card-foreground px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
            <div className="flex items-center gap-3">
              {showSkeleton ? (
                <div className="h-5 w-40 bg-muted rounded-lg animate-pulse" />
              ) : (
                <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                  {activeReport?.name}
                </h2>
              )}
            </div>

            {showSkeleton ? (
              <div className="h-7 w-28 bg-muted rounded-lg animate-pulse self-start sm:self-auto" />
            ) : activeReport?.iframe_link ? (
              <a
                href={activeReport.iframe_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            ) : null}
          </div>

          {/* Iframe / skeleton viewport */}
          <div className="relative w-full aspect-[16/9] min-h-[550px] sm:min-h-[680px] bg-muted/40">
            {showSkeleton ? (
              <div className="w-full h-full min-h-[550px] sm:min-h-[680px] bg-muted animate-pulse rounded-b-2xl" />
            ) : activeReport?.iframe_link ? (
              <iframe
                title={`DECM Cluster - ${activeReport.name}`}
                src={activeReport.iframe_link}
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full min-h-[520px] sm:min-h-[640px] rounded-b-2xl border-0"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center text-muted-foreground p-8">
                <p className="text-sm font-semibold">PowerBI report link is not configured.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
