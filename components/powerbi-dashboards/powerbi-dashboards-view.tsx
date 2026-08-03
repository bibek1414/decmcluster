"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  ExternalLink,
  Loader2,
  Info,
  Maximize2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI, usePowerBIDetail } from "@/hooks/use-powerbi";
import { PowerBIData } from "@/types/powerbi";
import { Button } from "@/components/ui/button";

const FALLBACK_POWERBI_DATA: PowerBIData[] = [
  {
    id: 5,
    name: "Sample data 2",
    iframe_link:
      "https://app.powerbi.com/view?r=eyJrIjoiZTUzYTIyYmItNTBjMy00ZDhiLTg2NjktMjNmZjIzYTdlZTI3IiwidCI6IjE1ODgyNjJkLTIzZmItNDNiNC1iZDZlLWJjZTQ5YzhlNjE4NiIsImMiOjh9",
    image:
      "https://decmcluster.blob.core.windows.net/media/power_bi_iframe/Screenshot_from_2026-08-02_17-21-43_jJNVN7Y.png",
    created_at: "2026-08-02T11:37:32.992917Z",
    updated_at: "2026-08-02T11:37:32.992927Z",
  },
  {
    id: 4,
    name: "Sample data 1",
    iframe_link:
      "https://app.powerbi.com/view?r=eyJrIjoiZTUzYTIyYmItNTBjMy00ZDhiLTg2NjktMjNmZjIzYTdlZTI3IiwidCI6IjE1ODgyNjJkLTIzZmItNDNiNC1iZDZlLWJjZTQ5YzhlNjE4NiIsImMiOjh9",
    image:
      "https://decmcluster.blob.core.windows.net/media/power_bi_iframe/Screenshot_from_2026-08-02_17-21-43.png",
    created_at: "2026-08-02T11:37:13.170512Z",
    updated_at: "2026-08-02T11:37:13.170523Z",
  },
];

interface PowerBIDashboardsViewProps {
  reportId?: number;
}

export function PowerBIDashboardsView({ reportId }: PowerBIDashboardsViewProps) {
  const { token } = useAuth();
  const { data: apiData = [], isLoading } = usePowerBI(token);

  // Available reports from API or fallback
  const reports = useMemo(() => {
    return apiData && apiData.length > 0 ? apiData : FALLBACK_POWERBI_DATA;
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
    return reports.find((r) => r.id === selectedId) || reports[0] || FALLBACK_POWERBI_DATA[0];
  }, [singleDetail, reports, selectedId]);

  return (
    <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20">
      {/* Hero Header matching screenshot style */}
      <section className="bg-primary py-8 sm:py-12 lg:py-16 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 sm:gap-2 text-xs text-primary-foreground/80 mb-4 sm:mb-6 font-medium flex-wrap"
          >
            <Link href="/" className="hover:text-primary-foreground transition-colors flex items-center gap-1">
              Home
            </Link>
            {activeReport && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60 shrink-0" />
                <span className="text-primary-foreground font-semibold truncate max-w-[200px]">
                  {activeReport.name}
                </span>
              </>
            )}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 max-w-full text-wrap leading-tight">
                PowerBI Analytics & Interactive Dashboards
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                {activeReport?.name || "PowerBI Dashboards"}
              </h1>
              <p className="text-sm sm:text-lg text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
                Interactive real-time visualization reports, spatial analytics and operational statistics for Vanuatu DECM Cluster.
              </p>
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                This page provides interactive data analytics, spatial visualizations and cluster metrics powered by Microsoft PowerBI. Data is updated in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
       

        {/* Embedded PowerBI Iframe Viewport */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden -lg space-y-0">
          <div className="bg-card text-card-foreground px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                {activeReport?.name}
              </h2>
            </div>

            {activeReport?.iframe_link && (
              <a
                href={activeReport.iframe_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            )}
          </div>

          <div className="relative w-full aspect-[16/9] min-h-[550px] sm:min-h-[680px] bg-muted/40 flex flex-col items-center justify-center p-2 sm:p-4">
            {isLoading || (isSingleLoading && !activeReport?.iframe_link) ? (
              <div className="flex flex-col items-center gap-3 text-foreground">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-xs font-bold text-muted-foreground">Loading PowerBI report iframe...</span>
              </div>
            ) : activeReport?.iframe_link ? (
              <iframe
                title={`DECM Cluster - ${activeReport.name}`}
                src={activeReport.iframe_link}
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full min-h-[520px] sm:min-h-[640px] rounded-xl border border-border -sm"
              />
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <p className="text-sm font-semibold">PowerBI report link is not configured.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
