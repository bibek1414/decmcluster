"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  ExternalLink,
  ChevronRight,
  Loader2,
  X,
  Maximize2,
  Calendar,
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

export default function HomePowerBISection() {
  const { token } = useAuth();
  const { data: apiData = [], isLoading } = usePowerBI(token);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedFallbackItem, setSelectedFallbackItem] = useState<PowerBIData | null>(null);

  const { data: detailData, isLoading: isDetailLoading } = usePowerBIDetail(selectedId, token);

  // Use API data if available, otherwise use fallback data from prompt
  const displayItems = apiData && apiData.length > 0 ? apiData : FALLBACK_POWERBI_DATA;

  // Active item inside detail modal
  const activeItem = detailData || selectedFallbackItem;

  const handleOpenModal = (item: PowerBIData) => {
    setSelectedId(item.id);
    setSelectedFallbackItem(item);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setSelectedFallbackItem(null);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };
    if (selectedId !== null) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  return (
    <section className="space-y-6 select-none">
      {/* Section Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white px-6 py-4 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <BarChart3 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Power BI Dashboards</h2>
            <p className="text-xs text-slate-300">
              Interactive real-time visualization reports & operational statistics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300">
          <span>{displayItems.length} Reports Available</span>
        </div>
      </div>

      {/* Grid of Two Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="h-80 rounded-2xl border border-border bg-card p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="h-48 bg-muted rounded-xl w-full" />
              <div className="space-y-2 mt-4">
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayItems.map((item) => {
            const hasImage = item.image && item.image.trim() !== "";
            const fallbackImage =
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="group bg-card text-card-foreground rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col overflow-hidden cursor-pointer relative"
              >
                {/* Thumbnail Image Banner */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
                  <img
                    src={hasImage ? item.image! : fallbackImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-blue-400/30 shadow-md flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Power BI Report</span>
                  </div>

                  {/* Overlay Expand Icon */}
                  <div className="absolute top-3.5 right-3.5 bg-slate-900/80 text-white p-2 rounded-full border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-extrabold tracking-tight drop-shadow-md group-hover:text-blue-300 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Card Footer Content */}
                <div className="p-5 flex items-center justify-between bg-card border-t border-border/60">
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[70%]">
                    Interactive visualization report for {item.name}
                  </p>

                  <Button
                    size="sm"
                    className="font-bold text-xs flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg cursor-pointer transition-transform group-hover:translate-x-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(item);
                    }}
                  >
                    <span>View More</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Power BI Interactive Detail Modal */}
      {selectedId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground leading-tight">
                    {activeItem?.name || "PowerBI Report Detail"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Interactive Report View (GET /api/dashboard/powerbi-iframe/{selectedId}/)
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Body - Embedded PowerBI Iframe */}
            <div className="relative w-full flex-1 min-h-[500px] sm:min-h-[600px] bg-slate-950 p-2 sm:p-4 overflow-hidden flex flex-col justify-center items-center">
              {isDetailLoading && !activeItem?.iframe_link ? (
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-xs font-semibold">Loading PowerBI report data...</span>
                </div>
              ) : activeItem?.iframe_link ? (
                <iframe
                  title={`DECM Cluster - ${activeItem.name}`}
                  src={activeItem.iframe_link}
                  frameBorder="0"
                  allowFullScreen={true}
                  className="w-full h-full min-h-[480px] sm:min-h-[560px] rounded-xl shadow-lg border border-slate-800"
                />
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <p className="text-sm font-semibold">PowerBI iframe report is not configured.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-border bg-muted/20">
              <div className="text-xs text-muted-foreground font-medium">
                {activeItem?.updated_at && (
                  <span>
                    Last updated:{" "}
                    {new Date(activeItem.updated_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeItem?.iframe_link && (
                  <a
                    href={activeItem.iframe_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                )}
                <Button
                  onClick={handleCloseModal}
                  size="sm"
                  variant="outline"
                  className="font-bold text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
