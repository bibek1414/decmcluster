import React from "react";
import { Card } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="border border-border p-5 bg-card space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-20 bg-muted rounded-full" />
        <div className="h-8 w-8 bg-muted rounded-lg" />
      </div>

      <div className="space-y-2">
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="space-y-1">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-4/5 bg-muted rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded col-span-2" />
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
        <div className="h-3.5 w-24 bg-muted rounded" />
        <div className="h-8 w-24 bg-muted rounded-lg" />
      </div>
    </Card>
  );
}
