"use client";

import React from "react";
import Link from "next/link";
import { FileText, FileSpreadsheet, Eye } from "lucide-react";
import { type AssessmentData } from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface AssessmentCardProps {
  a: AssessmentData;
}

export function AssessmentCard({ a }: AssessmentCardProps) {
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");

  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const formattedDate = a.created_at
    ? new Date(a.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <Card className="flex flex-col justify-between border border-border p-5 hover:border-foreground/20 transition-all group/card bg-card duration-200 shadow-sm rounded-xl">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 rounded-lg bg-primary/10 text-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-foreground group-hover/card:text-primary transition-colors line-clamp-2 leading-snug">
              {a.name} Data
            </h3>
            <p className="text-[10px] text-muted-foreground font-semibold mt-1">
              Created on {formattedDate}
            </p>
            {a.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {a.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs font-bold gap-1.5 cursor-pointer hover:bg-muted"
          asChild
        >
          <Link href={`/assement/${a.slug}`}>
            <Eye className="h-3.5 w-3.5" />
            View Data
          </Link>
        </Button>

        {a.pdf && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-[10px] font-bold gap-1 cursor-pointer border-blue-600/10 text-blue-700 hover:bg-blue-50/50 hover:text-blue-800"
            asChild
          >
            <a
              href={getFileUrl(a.pdf)}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="h-3 w-3" />
              PDF
            </a>
          </Button>
        )}

        {a.excel && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-[10px] font-bold gap-1 cursor-pointer border-green-600/10 text-green-700 hover:bg-green-50/50 hover:text-green-800"
            asChild
          >
            <a
              href={getFileUrl(a.excel)}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileSpreadsheet className="h-3 w-3" />
              Excel
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
}
