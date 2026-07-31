"use client";

import React from "react";
import { Newspaper, Calendar, Tag, Loader2, Sparkles } from "lucide-react";

export function LatestUpdateSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-label="Loading updates skeleton">
      {/* Featured Skeleton Card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="h-4 bg-muted rounded-md w-36" />
        </div>
        <div className="h-7 bg-muted rounded-lg w-3/4" />
        <div className="space-y-2 pt-1">
          <div className="h-4 bg-muted rounded-md w-full" />
          <div className="h-4 bg-muted rounded-md w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground/50" />
            <div className="h-3 bg-muted rounded-md w-24" />
          </div>
          <div className="h-4 bg-muted rounded-md w-24" />
        </div>
      </div>

      {/* Article List Item Skeletons */}
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="bg-card border border-border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start"
        >
          {/* Date Badge Skeleton */}
          <div className="bg-muted/60 rounded-xl p-3.5 text-center min-w-[90px] sm:min-w-[100px] shrink-0 border border-border space-y-2 flex flex-col items-center justify-center">
            <Newspaper className="w-5 h-5 text-muted-foreground/40" />
            <div className="h-5 bg-muted rounded-md w-10" />
            <div className="h-3 bg-muted rounded-md w-12" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 space-y-3 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground/40" />
              <div className="h-3.5 bg-muted rounded-full w-24" />
              <div className="h-3 bg-muted rounded-md w-28 ml-auto sm:ml-0" />
            </div>

            <div className="h-5 bg-muted rounded-lg w-4/5" />

            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 bg-muted rounded-md w-full" />
              <div className="h-3.5 bg-muted rounded-md w-2/3" />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="h-3.5 bg-muted rounded-md w-28" />
              <div className="h-3.5 bg-muted rounded-md w-16" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-muted-foreground">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span>Loading Latest Updates...</span>
      </div>
    </div>
  );
}
