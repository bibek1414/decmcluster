"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/assessment/page-header";
import { CsvViewer } from "@/components/assessment/csv-viewer";
import { Button } from "@/components/ui/button";
import { generateCsvData, getAssessment } from "@/lib/mock-data";

export default function AssessmentCsvPage() {
  const params = useParams();
  const id = params.id as string;
  const assessment = getAssessment(id);

  const rows = useMemo(() => {
    if (!assessment) return [];
    return generateCsvData(Math.min(assessment.totalRecords || 60, 180));
  }, [assessment]);

  if (!assessment) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">Assessment Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The assessment with ID <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{id}</code> may have been deleted or moved.
          </p>
          <Button asChild className="mt-2 font-bold cursor-pointer">
            <Link href="/assement">Back to assessments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        
        <Link
          href={`/assement/${assessment.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to assessment
        </Link>

        <PageHeader
          title="CSV Records Viewer"
          description={`${assessment.name} · ${rows.length.toLocaleString()} sample records displayed`}
          actions={
            <Button asChild variant="outline" className="cursor-pointer font-bold h-9">
              <Link href={`/assement/${assessment.id}`}>Details View</Link>
            </Button>
          }
        />

        <CsvViewer rows={rows} />
      </div>
    </div>
  );
}
