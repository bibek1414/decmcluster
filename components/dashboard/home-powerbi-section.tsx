"use client";

import React from "react";
import { BarChart3, ChevronRight, Maximize2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI } from "@/hooks/use-powerbi";
import { PowerBIData } from "@/types/powerbi";

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

  // Use API data if available, otherwise use fallback data from prompt
  const displayItems = apiData && apiData.length > 0 ? apiData : FALLBACK_POWERBI_DATA;

  return (
    <section className="space-y-6 select-none">
      {/* Section Header Banner */}
       

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
              <a
                key={item.id}
                href={`/powerbi-dashboards/${item.id}`}
                className="group bg-card text-card-foreground rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col overflow-hidden cursor-pointer relative"
              >
                {/* Thumbnail Image Banner */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-muted border-b border-border">
                  <img
                    src={hasImage ? item.image! : fallbackImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-primary text-primary-foreground text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Power BI Report</span>
                  </div>

                  {/* Overlay Expand Icon */}
                  <div className="absolute top-3.5 right-3.5 bg-background/80 text-foreground p-2 rounded-full border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-foreground">
                    <h3 className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Card Footer Content */}
                <div className="p-5 flex items-center justify-between bg-card border-t border-border/60">
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-[70%]">
                    Interactive visualization report for {item.name}
                  </p>

                  <div className="font-bold text-xs flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-lg transition-transform group-hover:translate-x-0.5">
                    <span>View More</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
