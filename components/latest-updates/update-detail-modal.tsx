"use client";

import { useEffect } from "react";
import {
  X,
  Tag,
  Calendar,
} from "lucide-react";
import { LatestUpdate } from "@/types/latest-update";

interface UpdateDetailModalProps {
  update: LatestUpdate | null;
  onClose: () => void;
  copiedId?: number | string | null;
  toastMsg?: string | null;
  onCopyLink: (id: number | string, customMsg?: string) => void;
}



function parseDateComponents(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "31", monthYear: "Jul 2026", full: dateStr };
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear();
    const full = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return { day, monthYear: `${month} ${year}`, full };
  } catch {
    return { day: "31", monthYear: "Jul 2026", full: dateStr };
  }
}

function getCategoryName(item: LatestUpdate): string {
  if (item.category_details?.name) {
    return item.category_details.name;
  }
  if (item.is_featured) return "Announcement";
  return "Resource";
}

export function UpdateDetailModal({
  update,
  onClose,
}: UpdateDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!update) return null;

  

  const categoryName = getCategoryName(update);
  const dateInfo = parseDateComponents(update.created_at);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card rounded-3xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4 sticky top-0 bg-card/95 backdrop-blur-md z-10 rounded-t-3xl">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              <Tag className="w-3 h-3 text-primary" />
              {categoryName}
            </span>
            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Published {dateInfo.full}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          <h2 className="text-2xl font-bold text-foreground leading-snug">
            {update.title}
          </h2>

          {update.thumbnail_image && (
            <div className="rounded-2xl overflow-hidden max-h-72 border border-border">
              <img
                src={update.thumbnail_image}
                alt={update.thumbnail_alt_desc || update.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-sm text-foreground leading-relaxed whitespace-pre-line">
            {update.description || update.short_description}
          </div>
        </div>

      </div>
    </div>
  );
}
