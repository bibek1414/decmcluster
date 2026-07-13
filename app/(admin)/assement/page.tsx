"use client";

import React, { useMemo, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { AssessmentCard } from "@/components/(admin)/assessment/assessment-card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuth } from "@/hooks/use-auth";
import { useAssessments } from "@/hooks/use-assessments";

const CORE_SLUGS = [
  "evacuation-centre-assessment-form",
  "damage-assessment-form-community-v2",
  "rapid-assessment-form-area-council",
  "displacement-tracking-matrix-form",
  "displacement-profile-phone-survey",
  "service-monitoring-tool-2026",
  "durable-solution-relocation-survey",
  "community-level-damage-assessment-form",
  "5w-response-data",
];

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const isSuperAdmin = user?.role === "Superadmin";

  const { data: assessments = [], isLoading, error } = useAssessments();

  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      // Filter out non-core displacement forms
      if (!CORE_SLUGS.includes(a.slug)) {
        return false;
      }
      // Enforce access control for non-superadmins
      if (!isSuperAdmin) {
        const acList = user?.access_control || [];
        const normalized = acList.map((item) =>
          item.toLowerCase().replace(/_/g, "-")
        );
        if (!normalized.includes(a.slug.toLowerCase())) {
          return false;
        }
      }
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [assessments, query, isSuperAdmin, user]);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="Displacement Data Forms"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Dynamic field survey forms, schemas, and media templates</span>
              {!isLoading && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {filtered.length} total forms
                </span>
              )}
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assessments by name..."
              className="h-9 pl-9 w-full bg-background"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded-xl w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            Failed to load assessments: {(error as Error).message}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No assessments found"
            description="No matching core assessment forms found."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a) => (
              <AssessmentCard key={a.id} a={a} hideDocLinks={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
