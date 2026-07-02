"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { useReports } from "@/hooks/use-reports";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export default function ReportsSection() {
  const { data, isLoading, error } = useReports(1);
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Navigation button active states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  const reports = data?.results || [];

  // Handle scroll detection for updating navigation button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      // Give a tiny tolerance of 5px for scrollRight
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      // Initial check after contents render
      setTimeout(checkScrollPosition, 500);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, [reports]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;

      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (error) return null;

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border transition-colors duration-300">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-primary flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Latest Reports & Publications
        </h2>

        {/* Navigation & View All link */}
        <div className="flex items-center gap-4">
          {reports.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted text-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className="h-8 w-8 rounded-full border border-border bg-background hover:bg-muted text-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video w-full bg-muted rounded-lg" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4"
          >
            {reports.map((rep) => {
              const fileOrUrl = getFileUrl(rep.file || rep.url);

              return (
                <div
                  key={rep.id}
                  className="flex flex-col space-y-3 group border border-transparent hover:border-border/30 hover:bg-muted/10 rounded-xl p-2.5 transition-all duration-200 snap-start shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(25%-18px)]"
                >
                  {/* Image Thumbnail */}
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/80 bg-muted/40 relative shadow-xs">
                    {rep.image ? (
                      <img
                        src={getFileUrl(rep.image)}
                        alt={rep.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      /* Beautiful Fallback Cover Graphic using theme primary color gradient */
                      <div className="w-full h-full bg-gradient-to-br from-primary via-primary/85 to-[#14b8a6]/80 flex flex-col justify-between p-3 text-white select-none">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                            {rep.type || "Document"}
                          </span>
                          <FileText className="w-4 h-4 text-white/80" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-extrabold line-clamp-2 leading-tight uppercase tracking-wider text-yellow-400">
                            {rep.name}
                          </p>
                          <p className="text-[8px] font-medium text-white/70">
                            DECM Cluster Vanuatu
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Report Content */}
                  <div className="flex-grow flex flex-col justify-between space-y-1">
                    <div>
                      {fileOrUrl ? (
                        <a
                          href={fileOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-primary hover:text-primary/85 hover:underline leading-snug line-clamp-2 min-h-[36px] block transition-colors"
                        >
                          {rep.name}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2 min-h-[36px] block">
                          {rep.name}
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <p className="text-[10px] text-muted-foreground font-semibold flex flex-wrap items-center gap-1 mt-1 pt-1.5">
                      <span>
                        {rep.date
                          ? formatDate(rep.date)
                          : formatDate(rep.created_at)}
                      </span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-primary font-extrabold">
                        {rep.type || "Publication"}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-muted/10 text-xs">
          No reports available at the moment.
        </div>
      )}
    </div>
  );
}
