"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTraining } from "@/hooks/use-training";
import { useDebounce } from "@/hooks/use-debounce";
import { Pagination } from "@/components/shared/pagination";

export default function TrainingClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isPlaceholderData, error } = useTraining(
    page,
    debouncedSearch,
  );

  const modulesList = data?.results || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Training & Capacity Building
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              E-learning resources, modules and field guidelines
            </p>
          </div>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
            Total Modules:{" "}
            <strong className="text-foreground font-extrabold">
              {data.count}
            </strong>
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">
            Available Modules
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs max-w-sm w-full sm:w-60 bg-background"
            />
          </div>
        </div>

        <div className="relative">
          {isLoading || isPlaceholderData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card flex items-center justify-between gap-4 h-[78px]"
                >
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                  <div className="w-20 h-8 bg-muted rounded shrink-0" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load training modules: {(error as Error).message}
            </div>
          ) : modulesList.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modulesList.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/20 transition-all duration-200 flex items-center justify-between gap-4 "
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                        {mod.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold">
                        Duration: {mod.duration}
                      </p>
                    </div>
                    {mod.link && (
                      <Button
                        size="sm"
                        className="shrink-0 cursor-pointer text-xs font-bold"
                        onClick={() =>
                          window.open(mod.link, "_blank", "noopener,noreferrer")
                        }
                      >
                        Start Course
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Reusable Pagination */}
              {data && (data.previous || data.next) && (
                <Pagination
                  currentPage={page}
                  hasPrevious={!!data.previous}
                  hasNext={!!data.next}
                  onPageChange={(p) => setPage(p)}
                  isPlaceholderData={isPlaceholderData}
                />
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
              No training modules match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
