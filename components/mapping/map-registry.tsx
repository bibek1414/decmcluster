"use client";

import React, { useState, useEffect } from "react";
import { Map, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMapCategories } from "@/hooks/use-map-categories";
import { useMapRegistry } from "@/hooks/use-map-registry";
import { useDebounce } from "@/hooks/use-debounce";
import { Pagination } from "@/components/shared/pagination";

export default function MapRegistry() {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Slugify helper to get URL friendly slugs from category names
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Fetch categories list
  const { data: categoriesData } = useMapCategories();

  // Reset to first page when category or search changes
  useEffect(() => {
    setPage(1);
  }, [activeCategorySlug, debouncedSearch]);

  // Fetch maps list
  const {
    data: mapsData,
    isLoading,
    isPlaceholderData,
    error,
  } = useMapRegistry(page, activeCategorySlug, debouncedSearch);

  const categories = categoriesData?.results || [];
  const mapsList = mapsData?.results || [];

  const activeCategoryName = activeCategorySlug
    ? categories.find((c) => slugify(c.name) === activeCategorySlug)?.name || "Selected Category"
    : "All Categories";

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      {/* Title */}
      <div className="border-b border-border pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Map Registry & Catalog
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Browse, filter, and download spatial reference maps by category
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Categories Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
            Categories
          </h3>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 scrollbar-thin">
            {/* All Categories Item */}
            <button
              onClick={() => setActiveCategorySlug(undefined)}
              className={`px-4 py-2 text-left rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer border border-border/80 ${
                activeCategorySlug === undefined
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-black hover:bg-neutral-50"
              }`}
            >
              All Categories
            </button>
            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const slug = slugify(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategorySlug(slug)}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer border border-border/80 ${
                    activeCategorySlug === slug
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-black hover:bg-neutral-50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Grid - Maps Display */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-muted-foreground">
              {mapsData
                ? `Showing ${mapsList.length} of ${mapsData.count} items in ${activeCategoryName}`
                : `Loading ${activeCategoryName}...`}
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search map registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-background w-full"
              />
            </div>
          </div>

          <div className="relative">
            {isLoading || isPlaceholderData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-border bg-card rounded-2xl overflow-hidden flex flex-col justify-between h-[300px]"
                  >
                    <div className="h-40 bg-muted w-full" />
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                      <div className="h-9 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                Failed to load maps catalog: {(error as Error).message}
              </div>
            ) : mapsList.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mapsList.map((mapItem) => {
                    const formattedDate = mapItem.created_at
                      ? new Date(mapItem.created_at).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "N/A";

                    return (
                      <div
                        key={mapItem.id}
                        className="border border-border bg-card hover:bg-muted/10 hover:border-primary/20 transition-all duration-200 rounded-2xl overflow-hidden flex flex-col justify-between h-[340px] shadow-sm group"
                      >
                        {/* Map Image Thumbnail or SVG Fallback */}
                        <div className="h-40 bg-muted/50 border-b border-border/80 relative flex items-center justify-center overflow-hidden">
                          {mapItem.image ? (
                            <img
                              src={mapItem.image}
                              alt={mapItem.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <>
                              {/* Topographic mock lines */}
                              <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <pattern id="previewGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                                    </pattern>
                                  </defs>
                                  <rect width="100%" height="100%" fill="url(#previewGrid)" />
                                </svg>
                              </div>
                              <Map className="w-8 h-8 text-primary/40 group-hover:scale-110 transition-transform duration-200" />
                            </>
                          )}

                          {/* Category Badge on thumbnail top-right */}
                          {mapItem.category_name && (
                            <span className="absolute top-3 right-3 text-[9px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                              {mapItem.category_name}
                            </span>
                          )}
                        </div>

                        {/* Text and Button details */}
                        <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug line-clamp-2">
                              {mapItem.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-2 font-semibold">
                              Published: <span className="text-foreground">{formattedDate}</span>
                            </p>
                          </div>
                          {mapItem.image && (
                            <button
                              onClick={() => window.open(mapItem.image, "_blank", "noopener,noreferrer")}
                              className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Image</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reusable Pagination */}
                {mapsData && (mapsData.previous || mapsData.next) && (
                  <Pagination
                    currentPage={page}
                    hasPrevious={!!mapsData.previous}
                    hasNext={!!mapsData.next}
                    onPageChange={(p) => setPage(p)}
                    isPlaceholderData={isPlaceholderData}
                  />
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
