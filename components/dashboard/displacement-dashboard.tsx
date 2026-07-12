"use client";

import React, { useMemo } from "react";
import { Users, User, UserCheck, Activity } from "lucide-react";
import { useDisplacementStats } from "@/hooks/use-dashboard";

export default function DisplacementDashboard() {
  const { data: stats, isLoading } = useDisplacementStats();

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        id: "total_idp",
        label: "Total IDPs",
        value: stats.total_idp.toLocaleString(),
        icon: Users,
      },
      {
        id: "total_male",
        label: "Total Male",
        value: stats.total_male.toLocaleString(),
        icon: User,
      },
      {
        id: "total_female",
        label: "Total Female",
        value: stats.total_female.toLocaleString(),
        icon: UserCheck,
      },
      {
        id: "operation_count",
        label: "Operations",
        value: stats.operation_count.toLocaleString(),
        icon: Activity,
      },
    ];
  }, [stats]);

  // All years including zeros
  const yearData = useMemo(() => stats?.idps_by_year ?? [], [stats]);

  const maxYearVal = useMemo(() => {
    if (yearData.length === 0) return 1;
    return Math.max(...yearData.map((y) => y.total_idp), 1);
  }, [yearData]);

  const admin1Data = useMemo(() => {
    if (!stats?.idps_by_admin1) return [];
    return [...stats.idps_by_admin1].sort((a, b) => b.total_idp - a.total_idp);
  }, [stats]);

  const maxAdmin1Val = useMemo(() => {
    if (admin1Data.length === 0) return 1;
    return Math.max(...admin1Data.map((a) => a.total_idp), 1);
  }, [admin1Data]);

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* 4 Stats Cards — same style as Summary grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border bg-card flex items-start gap-3.5 animate-pulse h-[72px]"
              />
            ))
          : statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="p-4 rounded-lg border flex items-start gap-3.5 bg-card text-card-foreground border-primary/40 bg-primary/5 transition-all duration-300 hover:border-primary/60"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-foreground leading-none">
                      {card.value}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 leading-tight">
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── IDPs by Year: Vertical Bar Chart ── */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground">IDPs by year</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Displaced persons per recorded event year
            </p>
          </div>

          {isLoading ? (
            <div
              className="flex items-end gap-3 animate-pulse"
              style={{ height: 220 }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-muted rounded-t"
                  style={{ height: 40 + i * 20 }}
                />
              ))}
            </div>
          ) : (
            <>
              {/* Chart wrapper — extra top space for the callout label above the bar */}
              <div className="relative" style={{ paddingTop: 56 }}>
                <div
                  className="flex items-end gap-2 border-b border-border"
                  style={{ height: 160 }}
                >
                  {yearData.map((row) => {
                    const CHART_H = 156;
                    const hasData = row.total_idp > 0;
                    const totalPx =
                      maxYearVal > 0
                        ? Math.max(
                            Math.round((row.total_idp / maxYearVal) * CHART_H),
                            hasData ? 8 : 4,
                          )
                        : 4;
                    const malePx = hasData
                      ? Math.round((row.total_male / row.total_idp) * totalPx)
                      : 0;
                    const femalePx = totalPx - malePx;

                    return (
                      <div
                        key={row.year}
                        className="flex-1 relative flex flex-col justify-end"
                      >
                        {/* Callout above bar — only for years with data */}
                        {hasData && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] w-max bg-foreground text-background rounded-lg px-2.5 py-1.5 shadow-md text-center pointer-events-none z-10">
                            <span className="block text-[10px] font-bold leading-tight">
                              {row.year}
                            </span>
                            <span className="block text-[11px] font-extrabold leading-tight mt-0.5">
                              {row.total_idp.toLocaleString()}
                            </span>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <span className="text-[9px] font-semibold text-blue-300">
                                ♂ {row.total_male.toLocaleString()}
                              </span>
                              <span className="text-[9px] font-semibold text-rose-300">
                                ♀ {row.total_female.toLocaleString()}
                              </span>
                            </div>
                            {/* Arrow pointing down */}
                            <span
                              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0"
                              style={{
                                borderLeft: "5px solid transparent",
                                borderRight: "5px solid transparent",
                                borderTop: "6px solid hsl(var(--foreground))",
                              }}
                            />
                          </div>
                        )}

                        {/* Stacked bar */}
                        <div
                          className="w-full flex flex-col justify-end rounded-t overflow-hidden cursor-default group"
                          style={{ height: totalPx }}
                        >
                          <div
                            className="w-full bg-rose-400 group-hover:bg-rose-500 transition-colors"
                            style={{ height: femalePx }}
                          />
                          <div
                            className="w-full bg-blue-500 group-hover:bg-blue-600 transition-colors"
                            style={{ height: malePx }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* X-axis year labels — only the year, total is in callout above */}
              <div className="flex gap-2 mt-2">
                {yearData.map((row) => (
                  <div key={row.year} className="flex-1 text-center">
                    <span className="block text-[10px] font-semibold text-muted-foreground">
                      {row.year}
                    </span>
                    {row.total_idp === 0 && (
                      <span className="block text-[10px] text-muted-foreground/60">
                        0
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom footer — year-specific breakdown */}
              {stats &&
                (() => {
                  // Find the year with most IDPs to label the footer
                  const peakYear = yearData.find(
                    (y) => y.total_idp === maxYearVal,
                  );
                  return peakYear ? (
                    <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                      <span className="text-[11px] font-bold text-muted-foreground shrink-0">
                        {peakYear.year}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
                          <span className="text-[11px] text-muted-foreground">
                            Male
                          </span>
                          <span className="text-[11px] font-bold text-blue-600">
                            {peakYear.total_male.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
                          <span className="text-[11px] text-muted-foreground">
                            Female
                          </span>
                          <span className="text-[11px] font-bold text-rose-500">
                            {peakYear.total_female.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-foreground border-l border-border pl-4">
                          Total {peakYear.total_idp.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })()}
            </>
          )}
        </div>

        {/* ── IDPs by Province (Admin1): Horizontal Bars ── */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-5 shadow-xs">
          {/* Header — no global totals here, each province shows its own breakdown inline */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-foreground">
              IDPs by province
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Displaced persons by administrative area
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {admin1Data.map((row) => {
                const totalPct = Math.round(
                  (row.total_idp / maxAdmin1Val) * 100,
                );
                const malePct =
                  row.total_idp > 0
                    ? Math.round((row.total_male / row.total_idp) * 100)
                    : 0;
                const femalePct = 100 - malePct;
                const hasData = row.total_idp > 0;
                return (
                  <div key={row.admin1_name}>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1.5">
                      <span>{row.admin1_name}</span>
                      <span
                        className={`font-bold ${hasData ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {hasData ? row.total_idp.toLocaleString() : "0"}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                      {hasData && (
                        <>
                          <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${(malePct / 100) * totalPct}%` }}
                          />
                          <div
                            className="h-full bg-rose-400 transition-all duration-1000"
                            style={{
                              width: `${(femalePct / 100) * totalPct}%`,
                            }}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-blue-500 font-semibold">
                        ♂ {row.total_male.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-rose-400 font-semibold">
                        ♀ {row.total_female.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
