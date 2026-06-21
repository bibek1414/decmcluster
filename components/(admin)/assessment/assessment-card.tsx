"use client";

import React from "react";
import Link from "next/link";
import { FileText, FileSpreadsheet, Eye } from "lucide-react";
import { type Assessment } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFilesForAssessment, stringifyCsv } from "@/lib/csv-storage";
import { toast } from "sonner";

interface AssessmentCardProps {
  a: Assessment;
}

export function AssessmentCard({ a }: AssessmentCardProps) {
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    const files = getFilesForAssessment(a.id);
    if (files.length === 0) {
      toast.error("No data versions available to download.");
      return;
    }

    // Sort by createdAt descending to get the latest file version
    const latestFile = [...files].sort((x, y) => 
      new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
    )[0];

    try {
      const csvContent = stringifyCsv(latestFile.headers, latestFile.rows);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", latestFile.name);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded latest CSV: ${latestFile.name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CSV download");
    }
  };

  return (
    <Card className="flex flex-col justify-between border border-border p-5 hover:border-foreground/20 transition-all group/card bg-card duration-200 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground group-hover/card:text-primary transition-colors line-clamp-2">
              {a.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {a.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2.5">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-9 text-xs font-bold gap-1.5 cursor-pointer hover:bg-muted"
          asChild
        >
          <Link href={`/assement/${a.id}`}>
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="flex-1 h-9 text-xs font-bold gap-1.5 cursor-pointer border-green-600/20 text-green-700 hover:bg-green-50 hover:border-green-600/50"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Download CSV
        </Button>
      </div>
    </Card>
  );
}
