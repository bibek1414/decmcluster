"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, ClipboardList, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/assessment/page-header";
import { AssessmentCard } from "@/components/assessment/assessment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/assessment/empty-state";
import { assessments as initial, type Assessment } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AssessmentsPage() {
  const [items, setItems] = useState<Assessment[]>(initial);
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [items, query]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a name for the assessment");
      return;
    }

    const newAssessment: Assessment = {
      id: `asm_${Math.floor(10 + Math.random() * 90)}`,
      name: newName,
      description: newDesc || "No description provided.",
      status: "Completed",
      createdAt: new Date().toISOString(),
      totalRecords: Math.floor(100 + Math.random() * 1500),
      owner: "System Administrator",
      duration: "1h 30m",
    };

    setItems((s) => [newAssessment, ...s]);
    setNewName("");
    setNewDesc("");
    setIsCreateOpen(false);
    toast.success("Assessment created successfully");
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="Displacement Data"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Field survey forms, data schemas and mobile templates</span>
              <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                {items.length} total ·{" "}
                {items.filter((a) => a.status === "Completed").length} completed
              </span>
            </div>
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="cursor-pointer font-bold border-green-600/20 text-green-700 hover:bg-green-50 hover:text-green-800"
                asChild
              >
                <a
                  href="/csv/Evacuation Center Master List.xlsx"
                  download="Evacuation Center Master List.xlsx"
                >
                  <FileText className="mr-1.5 h-4 w-4" /> Download Master List
                  (Excel)
                </a>
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer font-bold border-blue-600/20 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                asChild
              >
                <a
                  href="/response-tracking/Response Tracking Tool 5W DECM Cluster.xlsx"
                  download="5W Response Data.xlsx"
                >
                  <FileText className="mr-1.5 h-4 w-4" /> Download 5W Response
                  data
                </a>
              </Button>
              <Button
                className="cursor-pointer font-bold"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Assessment
              </Button>
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

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No assessments found"
            description="Try adjusting your filters or create your first assessment to get started."
            action={
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="cursor-pointer font-bold"
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Assessment
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a) => (
              <AssessmentCard key={a.id} a={a} />
            ))}
          </div>
        )}
      </div>

      {/* Custom Modal for New Assessment */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Create New Assessment
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreateOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Assessment Name
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Q1 Evacuation Center Survey"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the assessment objectives and scope..."
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-9 font-bold cursor-pointer">
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
