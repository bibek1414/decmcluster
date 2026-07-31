"use client";

import React from "react";
import {
  Tag,
  Calendar,
  Share2,
  Check,
} from "lucide-react";
import { LatestUpdate } from "@/types/latest-update";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UpdateDetailModalProps {
  update: LatestUpdate | null;
  onClose: () => void;
  copiedId?: number | string | null;
  toastMsg?: string | null;
  onCopyLink?: (id: number | string, customMsg?: string) => void;
}

function parseDateComponents(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { full: dateStr };
    const full = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return { full };
  } catch {
    return { full: dateStr };
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
  copiedId,
  toastMsg,
  onCopyLink,
}: UpdateDetailModalProps) {
  if (!update) return null;

  const categoryName = getCategoryName(update);
  const dateInfo = parseDateComponents(update.created_at);
  const isCopied = copiedId === update.id;

  return (
    <Dialog open={!!update} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="!max-w-2xl sm:!max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-border bg-card ">
        <DialogHeader className="space-y-3 pb-2 text-left">
          {/* Aligned Category Tag & Published Date Metadata Row */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Tag className="w-3.5 h-3.5 text-primary" />
              {categoryName}
            </span>
            <span className="text-muted-foreground/40 font-bold">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Published {dateInfo.full}</span>
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-snug tracking-tight">
            {update.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details for update: {update.title}
          </DialogDescription>
        </DialogHeader>

        <hr className="border-border/60 my-2" />

        {/* Modal Scrollable Content Body */}
        <div className="space-y-6 flex-1 py-1">
          {update.thumbnail_image && (
            <div className="rounded-2xl overflow-hidden max-h-80 border border-border bg-muted/30">
              <img
                src={update.thumbnail_image}
                alt={update.thumbnail_alt_desc || update.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
            {update.description || update.short_description}
          </div>
        </div>

        
      </DialogContent>
    </Dialog>
  );
}

