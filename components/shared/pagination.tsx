import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
  isPlaceholderData?: boolean;
}

export function Pagination({
  currentPage,
  hasPrevious,
  hasNext,
  onPageChange,
  isPlaceholderData = false,
}: PaginationProps) {
  return (
    <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
      <div className="text-[11px] text-muted-foreground font-medium">
        Page <strong className="text-foreground">{currentPage}</strong>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious || isPlaceholderData}
          className="h-7 text-[11px] font-extrabold cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext || isPlaceholderData}
          className="h-7 text-[11px] font-extrabold cursor-pointer flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
