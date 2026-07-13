"use client";

import Link from "next/link";
import { FileText, FileSpreadsheet, Eye } from "lucide-react";
import { type AssessmentData } from "@/types/assessment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface AssessmentCardProps {
  a: AssessmentData;
  hideDocLinks?: boolean;
  isTool?: boolean;
}

export function AssessmentCard({ a, hideDocLinks = false, isTool = false }: AssessmentCardProps) {
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
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-[10px] text-muted-foreground font-semibold">
                Created on {formattedDate}
              </p>
              {a.is_public ? (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold border border-emerald-200">
                  Public
                </span>
              ) : (
                <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-extrabold border border-amber-200">
                  Private
                </span>
              )}
            </div>
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
          className={`${hideDocLinks ? "w-full" : "flex-1"} h-8 text-xs font-bold gap-1.5 cursor-pointer hover:bg-muted`}
          asChild
        >
          <Link href={isTool ? `/assement/tools/${a.slug}` : `/assement/${a.slug}`}>
            <Eye className="h-3.5 w-3.5" />
            View Data
          </Link>
        </Button>

        {!hideDocLinks && a.pdf &&
          (() => {
            const isCsv =
              a.pdf.toLowerCase().endsWith(".csv") ||
              a.pdf.toLowerCase().endsWith(".xlsx") ||
              a.pdf.toLowerCase().endsWith(".xls");
            const label = isCsv ? "Excel/CSV" : "PDF/Doc";
            const IconComponent = isCsv ? FileSpreadsheet : FileText;
            const colorClass = isCsv
              ? "border-green-600/10 text-green-700 hover:bg-green-50/50 hover:text-green-800"
              : "border-blue-600/10 text-blue-700 hover:bg-blue-50/50 hover:text-blue-800";
            return (
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 h-8 text-[10px] font-bold gap-1 cursor-pointer ${colorClass}`}
                asChild
              >
                <a
                  href={getFileUrl(a.pdf)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconComponent className="h-3 w-3" />
                  {label}
                </a>
              </Button>
            );
          })()}

        {!hideDocLinks && a.excel && (
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
