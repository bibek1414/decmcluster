"use client";

import React, { useState } from "react";
import {
  Calendar,
  Layers,
  Activity,
} from "lucide-react";
import { useAssessmentRegistry } from "@/hooks/use-assessment-registry";
import { Pagination } from "@/components/shared/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function AssessmentRegistryTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPlaceholderData, error } =
    useAssessmentRegistry(page);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  const parseSurveyTools = (toolsStr: string | null) => {
    if (!toolsStr) return [];
    return toolsStr
      .split(/[;,\r\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  };

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      {/* Header section matching page styles */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Assessment Registry
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Database of active assessment tools, survey types, and frequencies
              across Vanuatu
            </p>
          </div>
        </div>
        {data && (
          <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
            Total Records:{" "}
            <strong className="text-foreground font-extrabold">
              {data.count}
            </strong>
          </span>
        )}
      </div>

      <div className="relative border border-border rounded-xl overflow-hidden bg-card">
        {/* Loading overlay for smooth transitions */}
        {isPlaceholderData && (
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity animate-fadeIn">
            <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold text-foreground">
                Updating...
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="border border-border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Survey Type</TableHead>
                    <TableHead className="w-[15%]">Level</TableHead>
                    <TableHead className="w-[15%]">Frequency</TableHead>
                    <TableHead className="w-[25%]">Survey Tools</TableHead>
                    <TableHead className="w-[15%]">Last Conducted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2].map((i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-3/4" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-1/3" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="inline-flex p-4 rounded-xl border border-red-200/50 bg-red-50/50 text-red-700 text-xs font-semibold max-w-md dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load registry: {(error as Error).message}
            </div>
          </div>
        ) : !data || data.results.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No registry records available.
          </div>
        ) : (
          <div className="overflow-x-auto animate-fadeIn">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="font-extrabold text-sm  text-muted-foreground px-4 py-3">
                    Survey Type
                  </TableHead>
                  <TableHead className="font-extrabold text-sm  text-muted-foreground px-4 py-3">
                    Level
                  </TableHead>
                  <TableHead className="font-extrabold text-sm  text-muted-foreground px-4 py-3">
                    Frequency
                  </TableHead>
                  <TableHead className="font-extrabold text-sm  text-muted-foreground px-4 py-3">
                    Survey Tools
                  </TableHead>
                  <TableHead className="font-extrabold text-sm  text-muted-foreground px-4 py-3">
                    Last Conducted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.results.map((registry) => (
                  <TableRow
                    key={registry.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-4 py-3 font-bold text-foreground text-xs align-top max-w-[240px] whitespace-normal leading-relaxed">
                      {registry.types_of_survey}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white border border-primary">
                        {registry.level_of_survey}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top text-xs text-muted-foreground font-medium">
                      {registry.frequency ? (
                        <span className="flex items-center gap-1 bg-primary/10 text-primary border border-primary rounded px-2 py-0.5 w-fit">
                          <Activity className="w-3 h-3" />
                          {registry.frequency}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic font-normal">
                          Not specified
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top text-xs max-w-[320px] whitespace-normal">
                      <div className="flex flex-col gap-1.5">
                        {parseSurveyTools(registry.name_of_survey_tool).map(
                          (tool, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] text-foreground font-medium leading-snug bg-muted/40 border border-border/60 rounded px-2 py-1 flex items-start gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                              <span>{tool}</span>
                            </div>
                          ),
                        )}
                        {parseSurveyTools(registry.name_of_survey_tool)
                          .length === 0 && (
                          <span className="text-muted-foreground/60 italic">
                            No tools registered
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top text-xs font-bold text-foreground">
                      {registry.last_survey_conducted ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                          <span>
                            {formatDate(registry.last_survey_conducted)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 italic font-normal">
                          -
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Footer */}
        {data && (data.previous || data.next) && (
          <Pagination
            currentPage={page}
            hasPrevious={!!data.previous}
            hasNext={!!data.next}
            onPageChange={(p) => setPage(p)}
            isPlaceholderData={isPlaceholderData}
          />
        )}
      </div>
    </div>
  );
}
