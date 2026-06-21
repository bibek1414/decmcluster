import React from "react";
import { type AssessmentStatus } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: AssessmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let styles = "bg-muted text-muted-foreground border-border";

  switch (status) {
    case "Completed":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50";
      break;
    case "Processing":
      styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50";
      break;
    case "Failed":
      styles = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-800/50";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {status}
    </span>
  );
}
