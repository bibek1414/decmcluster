"use client";

import { BarChart3, ChevronRight,  } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePowerBI } from "@/hooks/use-powerbi";

export default function HomePowerBISection() {
  const { token } = useAuth();
  const { data: apiData = [], isLoading } = usePowerBI(token);

  // Only show if API data is available
  const displayItems = apiData && apiData.length > 0 ? apiData : [];

  // Hide section entirely if loading is done and there's no data
  if (!isLoading && displayItems.length === 0) return null;

  return (
    <section className="space-y-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon/Image Block */}
        

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">
              PowerBI Analytics
            </h2>
            
          </div>
        </div>

        
      </div>

      {/* Grid of Cards */}
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
                className="group bg-card text-card-foreground rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 -sm hover:-xl flex flex-col overflow-hidden cursor-pointer relative"
              >
                {/* Thumbnail Image Banner */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-muted rounded-t-2xl">
                  <img
                    src={hasImage ? item.image! : fallbackImage}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                </div>

                {/* Overlapping Round Icon Badge */}
                <div className="relative px-6">
                  <div className="absolute -top-6 sm:-top-7 left-6 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground border-4 border-card -md">
                    <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="pt-8 sm:pt-9 px-6 pb-6 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary">
                    {item.name}
                  </h3>

                  {/* Decorative underline bar */}
                  <div className="w-8 h-1 bg-primary rounded-full my-3" />

                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6 flex-1 font-normal">
                    Interactive visualization report for {item.name}
                  </p>

                  {/* View Details Action */}
                  <div>
                    <span className="inline-flex items-center text-sm font-bold text-primary hover:underline group-hover:translate-x-1 transition-transform">
                      <span>View Dashboard</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
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
