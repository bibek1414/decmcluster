"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, ClipboardList, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { AssessmentCard } from "@/components/(admin)/assessment/assessment-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUpload } from "@/components/shared/file-upload";
import { useAuth } from "@/hooks/use-auth";
import { useAssessments } from "@/hooks/use-assessments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment";
import { toast } from "sonner";

export default function AssessmentsPage() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPdf, setNewPdf] = useState<File | null>(null);
  const [newExcel, setNewExcel] = useState<File | null>(null);

  // Role permissions
  const isSuperAdmin = user?.role === "Superadmin";
  const isDataEnumerator = user?.role === "Data Enumerator";
  const isFieldCoordinator = user?.role === "Field Coordinator";
  const canAdd = isSuperAdmin || isDataEnumerator || isFieldCoordinator;

  // Fetch assessments
  const { data: assessments = [], isLoading, error } = useAssessments();

  // Create assessment mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!newName.trim()) {
        throw new Error("Please enter a name for the assessment");
      }
      return assessmentService.create(newName, newDesc, newPdf, newExcel, token);
    },
    onSuccess: () => {
      toast.success("Assessment created successfully");
      setIsCreateOpen(false);
      setNewName("");
      setNewDesc("");
      setNewPdf(null);
      setNewExcel(null);
      queryClient.invalidateQueries({ queryKey: ["assessments-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create assessment");
    },
  });

  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [assessments, query]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

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
                  {assessments.length} total forms
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button
                className="cursor-pointer font-bold"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="mr-1.5 h-4 w-4" /> New Assessment
              </Button>
            )
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
            description={
              canAdd
                ? "Try adjusting your filters or create your first assessment to get started."
                : "No assessments have been registered yet."
            }
            action={
              canAdd ? (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="cursor-pointer font-bold"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> New Assessment
                </Button>
              ) : undefined
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
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
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
                  placeholder="e.g. Displacement Tracking Matrix 2026"
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

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  PDF Template File (Optional)
                </label>
                <FileUpload
                  selectedFile={newPdf}
                  onFileSelect={setNewPdf}
                  accept=".pdf"
                  helperText="Drag & drop PDF here or click to browse"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Excel Template File (Optional)
                </label>
                <FileUpload
                  selectedFile={newExcel}
                  onFileSelect={setNewExcel}
                  accept=".xlsx,.xls"
                  helperText="Drag & drop Excel here or click to browse"
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
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
