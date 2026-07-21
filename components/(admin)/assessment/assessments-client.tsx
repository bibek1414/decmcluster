"use client";

import React, { useMemo, useState } from "react";
import { Search, FileText, FileSpreadsheet, Eye, Database } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";

interface StaticEntry {
  id: number;
  name: string;
  slug: string;
  description: string;
  pdf: string | null;
  excel: string | null;
  is_public: boolean;
  created_at: string;
  isInteractive?: boolean;
}

// Static "Displacement Data" interactive entry
const DISPLACEMENT_DATA_ENTRY: StaticEntry = {
  id: 0,
  name: "Displacement Data",
  slug: "displacement-data",
  description:
    "Interactive database table for viewing, editing, and exporting displacement tracking records.",
  pdf: null,
  excel: null,
  is_public: false,
  created_at: "2026-06-29T09:43:18.876467Z",
  isInteractive: true,
};

// Evacuation Centre also has interactive data
const EVACUATION_DATA_ENTRY: StaticEntry = {
  id: -1,
  name: "Evacuation Centre Data",
  slug: "evacuation-centre-assessment-form",
  description:
    "Interactive database table for viewing, editing, and exporting evacuation centre records.",
  pdf: null,
  excel: null,
  is_public: false,
  created_at: "2026-06-29T09:42:24.988497Z",
  isInteractive: true,
};

// The 9 static assessment form cards from the API (hardcoded)
const STATIC_FORMS: StaticEntry[] = [
  {
    id: 11,
    name: "5W Response Data",
    slug: "5w-response-data",
    description: "",
    pdf: null,
    excel: null,
    is_public: false,
    created_at: "2026-07-08T05:24:59.054843Z",
  },
  {
    id: 7,
    name: "Durable Solution & Relocation Survey",
    slug: "durable-solution-relocation-survey",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:46:21.491656Z",
  },
  {
    id: 6,
    name: "Service Monitoring Tool 2026",
    slug: "service-monitoring-tool-2026",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:46:02.266457Z",
  },
  {
    id: 5,
    name: "Displacement Profile - Phone Survey",
    slug: "displacement-profile-phone-survey",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:43:39.308190Z",
  },
  {
    id: 4,
    name: "Displacement Tracking Matrix Form",
    slug: "displacement-tracking-matrix-form",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:43:18.876467Z",
  },
  {
    id: 3,
    name: "Rapid Assessment Form (Area Council)",
    slug: "rapid-assessment-form-area-council",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:43:02.681094Z",
  },
  {
    id: 2,
    name: "Damage Assessment Form (Community V2)",
    slug: "damage-assessment-form-community-v2",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:42:47.271853Z",
  },
  {
    id: 1,
    name: "Community Level Damage Assessment Form",
    slug: "community-level-damage-assessment-form",
    description: "",
    pdf: null,
    excel: null,
    is_public: true,
    created_at: "2026-06-29T09:42:24.988497Z",
  },
];

// Village Assessment also has interactive data
const VILLAGE_ASSESSMENT_ENTRY: StaticEntry = {
  id: -2,
  name: "Village Assessment",
  slug: "village-assessment",
  description:
    "Interactive database table for viewing, editing, and exporting village assessment records.",
  pdf: null,
  excel: null,
  is_public: false,
  created_at: "2026-07-21T00:00:00.000000Z",
  isInteractive: true,
};

// 5W Response Data interactive entry
const FIVEW_RESPONSE_DATA_ENTRY: StaticEntry = {
  id: 11,
  name: "5W Response Data",
  slug: "5w-response-data",
  description:
    "Interactive database table for viewing, editing, and exporting 5W response activity records.",
  pdf: null,
  excel: null,
  is_public: false,
  created_at: "2026-07-08T05:24:59.054843Z",
  isInteractive: true,
};

// All entries shown on Displacement Data page
const ALL_ENTRIES: StaticEntry[] = [
  DISPLACEMENT_DATA_ENTRY,
  EVACUATION_DATA_ENTRY,
  VILLAGE_ASSESSMENT_ENTRY,
  FIVEW_RESPONSE_DATA_ENTRY,
  ...STATIC_FORMS.filter((f) => f.slug !== "5w-response-data"),
];

function StaticCard({ entry }: { entry: StaticEntry }) {
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) return urlPath;
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const formattedDate = entry.created_at
    ? new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <Card className="flex flex-col justify-between border border-border p-5 hover:border-foreground/20 transition-all group/card bg-card duration-200 shadow-none rounded-xl">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 p-2 rounded-lg shrink-0 transition-colors group-hover/card:text-primary-foreground ${
              entry.isInteractive
                ? "bg-primary/10 text-primary group-hover/card:bg-primary"
                : "bg-muted text-muted-foreground group-hover/card:bg-primary"
            }`}
          >
            {entry.isInteractive ? (
              <Database className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-base text-foreground group-hover/card:text-primary transition-colors line-clamp-2 leading-snug">
              {entry.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-[10px] text-muted-foreground font-semibold">
                {entry.isInteractive ? "Interactive Table" : `Created on ${formattedDate}`}
              </p>
              {entry.isInteractive ? (
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-extrabold border border-primary/20">
                  Live Data
                </span>
              ) : entry.is_public ? (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold border border-emerald-200">
                  Public
                </span>
              ) : (
                <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-extrabold border border-amber-200">
                  Private
                </span>
              )}
            </div>
            {entry.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex gap-2">
        {entry.isInteractive ? (
          <Button
            variant="default"
            size="sm"
            className="w-full h-8 text-xs font-bold gap-1.5 cursor-pointer"
            asChild
          >
            <Link href={`/assement/${entry.slug}`}>
              <Eye className="h-3.5 w-3.5" />
              View Data
            </Link>
          </Button>
        ) : (
          <>
            {entry.pdf &&
              (() => {
                const isCsv =
                  entry.pdf!.toLowerCase().endsWith(".csv") ||
                  entry.pdf!.toLowerCase().endsWith(".xlsx") ||
                  entry.pdf!.toLowerCase().endsWith(".xls");
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
                      href={getFileUrl(entry.pdf)}
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
            {entry.excel && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-[10px] font-bold gap-1 cursor-pointer border-green-600/10 text-green-700 hover:bg-green-50/50 hover:text-green-800"
                asChild
              >
                <a
                  href={getFileUrl(entry.excel)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileSpreadsheet className="h-3 w-3" />
                  Excel
                </a>
              </Button>
            )}
            {!entry.pdf && !entry.excel && (
              <span className="text-[10px] text-muted-foreground/50 italic self-center">
                No template files
              </span>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export function AssessmentsClient() {
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "Superadmin";

  const filtered = useMemo(() => {
    let list = ALL_ENTRIES;

    if (!isSuperAdmin) {
      const userAccess = (user?.access_control || []).map((item) =>
        item.toLowerCase().replace(/_/g, "-")
      );
      list = list.filter((e) => userAccess.includes(e.slug.toLowerCase()));
    }

    if (!query.trim()) return list;
    return list.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, isSuperAdmin, user]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="Displacement Data"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Field survey forms, schemas, and interactive data tables</span>
              <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                {filtered.length} total data
              </span>
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name..."
              className="h-9 pl-9 w-full bg-background shadow-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No matching entries found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((entry) => (
              <StaticCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
