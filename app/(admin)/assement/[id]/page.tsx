"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Database, Download, FileSpreadsheet, Trash2, User, Clock } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/(admin)/assessment/status-badge";
import { getAssessment } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const a = getAssessment(id);

  if (!a) {
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

  const date = new Date(a.createdAt).toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleDelete = () => {
    toast.success("Assessment deleted successfully");
    router.push("/assement");
  };

  const handleDownload = () => {
    toast.success("CSV download started");
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        
        <Link
          href="/assement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All assessments
        </Link>

        <PageHeader
          title={a.name}
          description={a.description}
          actions={
            <>
              <Button asChild variant="secondary" className="cursor-pointer font-bold h-9">
                <Link href={`/assement/${a.id}/csv`}>
                  <FileSpreadsheet className="mr-1.5 h-4 w-4" /> View CSV
                </Link>
              </Button>
              <Button 
                onClick={handleDownload} 
                disabled={a.status !== "Completed"}
                className="cursor-pointer font-bold h-9"
              >
                <Download className="mr-1.5 h-4 w-4" /> Download
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive/10 h-9 w-9 rounded-lg cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          }
        />

        <div className="flex items-center gap-3">
          <StatusBadge status={a.status} />
          <span className="text-xs text-muted-foreground font-semibold">ID: {a.id}</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailStat icon={Database} label="Total Records" value={a.totalRecords.toLocaleString()} />
          <DetailStat icon={Calendar} label="Created Date" value={date} />
          <DetailStat icon={User} label="Owner / Lead" value={a.owner} />
          <DetailStat icon={Clock} label="Duration" value={a.duration} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2 border border-border bg-card space-y-5">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight">Overview</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Pass rate", value: "78%" },
                { label: "Avg. score", value: "82.4" },
                { label: "Top team", value: "Engineering" },
                { label: "Submissions", value: a.totalRecords.toLocaleString() },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border p-3.5 bg-muted/20">
                  <p className="text-[10px] text-muted-foreground font-semibold">{m.label}</p>
                  <p className="mt-1 text-base font-bold text-foreground tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border border-border bg-card space-y-4">
            <h3 className="text-sm font-extrabold text-foreground tracking-tight">Timeline</h3>
            <ol className="relative border-l border-border ml-2 space-y-5">
              {[
                { label: "Assessment created", time: date },
                { label: "Data ingestion completed", time: "+12m" },
                { label: "Processing started", time: "+18m" },
                { label: a.status === "Completed" ? "Results published" : "In progress", time: a.duration },
              ].map((t, i) => (
                <li key={i} className="relative pl-6">
                  <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border border-card bg-primary" />
                  <p className="text-xs font-bold text-foreground">{t.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.time}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
          <p className="truncate text-xs font-bold text-foreground mt-0.5">{value}</p>
        </div>
      </div>
    </Card>
  );
}
