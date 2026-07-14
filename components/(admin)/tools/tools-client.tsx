"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Plus, Search, ClipboardList, X, Loader2, Edit, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUpload } from "@/components/shared/file-upload";
import { useAuth } from "@/hooks/use-auth";
import {
  useAssessments,
  useCreateAssessment,
  useDeleteAssessment,
  useUpdateAssessment,
} from "@/hooks/use-assessments";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { siteConfig } from "@/config/site";

export function ToolsClient() {
  const { user, token } = useAuth();

  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPdf, setNewPdf] = useState<File | null>(null);
  const [newExcel, setNewExcel] = useState<File | null>(null);
  const [newIsPublic, setNewIsPublic] = useState(true);

  const [editTarget, setEditTarget] = useState<any>(null);
  const updateMutation = useUpdateAssessment();

  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
    slug: string;
  } | null>(null);
  const deleteMutation = useDeleteAssessment();

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const closeModal = () => {
    setIsCreateOpen(false);
    setEditTarget(null);
    setNewName("");
    setNewDesc("");
    setNewPdf(null);
    setNewExcel(null);
    setNewIsPublic(true);
  };

  // Escape key handler to close create modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Role permissions
  const isSuperAdmin = user?.role === "Superadmin";
  const isDataEnumerator = user?.role === "Data Enumerator";
  const isFieldCoordinator = user?.role === "Field Coordinator";
  const canAdd = isSuperAdmin || isDataEnumerator || isFieldCoordinator;

  // Fetch assessments
  const { data: assessments = [], isLoading, error } = useAssessments();

  // Create assessment mutation
  const createMutation = useCreateAssessment();

  const filtered = useMemo(() => {
    return assessments.filter((a) => {
      // Enforce access control for non-superadmins
      if (!isSuperAdmin) {
        const acList = user?.access_control || [];
        const normalized = acList.map((item) => item.toLowerCase().replace(/_/g, "-"));
        if (!normalized.includes(a.slug.toLowerCase())) {
          return false;
        }
      }
      const matchesQuery = a.name.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [assessments, query, isSuperAdmin, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a name for the assessment");
      return;
    }

    if (editTarget) {
      updateMutation.mutate(
        {
          slug: editTarget.slug,
          name: newName,
          description: newDesc,
          pdf: newPdf,
          excel: newExcel,
          isPublic: newIsPublic,
          token,
        },
        {
          onSuccess: () => {
            toast.success("Assessment updated successfully");
            closeModal();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to update assessment");
          },
        },
      );
    } else {
      createMutation.mutate(
        {
          name: newName,
          description: newDesc,
          pdf: newPdf,
          excel: newExcel,
          isPublic: newIsPublic,
          token,
        },
        {
          onSuccess: () => {
            toast.success("Assessment created successfully");
            closeModal();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to create assessment");
          },
        },
      );
    }
  };

  const handleEdit = (a: any) => {
    setEditTarget(a);
    setNewName(a.name);
    setNewDesc(a.description || "");
    setNewPdf(null); // File inputs cannot show existing files
    setNewExcel(null);
    setNewIsPublic(a.is_public);
    setIsCreateOpen(true);
  };

  const handleDelete = (id: number, name: string, slug: string) => {
    setDeleteTarget({ id, name, slug });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(
        { slug: deleteTarget.slug, token },
        {
          onSuccess: () => {
            toast.success("Assessment tool deleted successfully");
            setDeleteTarget(null);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to delete assessment tool");
            setDeleteTarget(null);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="New Tools"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Create and manage assessments and survey forms</span>
              {!isLoading && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {filtered.length} total forms
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button
                className="cursor-pointer font-bold"
                onClick={() => {
                  closeModal();
                  setIsCreateOpen(true);
                }}
              >
                <Plus className="mr-1.5 h-4 w-4" /> New IM Tools
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
                  onClick={() => {
                    closeModal();
                    setIsCreateOpen(true);
                  }}
                  className="cursor-pointer font-bold"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> New Assessment
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                  <th className="p-4 w-[50%]">Tool Name</th>
                  <th className="p-4 w-[15%]">Visibility</th>
                  <th className="p-4 w-[20%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {filtered.map((a) => {
                  return (
                    <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-bold text-foreground">
                        <span className="truncate max-w-xs block">
                          {a.name.replace(/\bForm\b/gi, "Data")}
                        </span>
                      </td>
                      <td className="p-4">
                        {a.is_public ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                            Private
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {(a.pdf || a.excel) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 font-bold cursor-pointer gap-1"
                              onClick={() => window.open(getFileUrl(a.pdf || a.excel), "_blank")}
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleEdit(a)}
                            title="Edit Tool"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {canAdd && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                              onClick={() => handleDelete(a.id, a.name, a.slug)}
                              title="Delete Tool"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Modal for New/Edit Assessment */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editTarget ? "Edit Assessment" : "Create New Assessment"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-xs font-bold text-muted-foreground">Description</label>
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
                  PDF/CSV/Document Template (Optional)
                </label>
                <FileUpload
                  selectedFile={newPdf}
                  onFileSelect={setNewPdf}
                  accept=".pdf,.csv,.xlsx,.xls,.doc,.docx"
                  helperText="Drag & drop PDF, CSV, or document here or click to browse"
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

              <div className="flex items-center gap-2 pt-1 pb-2">
                <input
                  type="checkbox"
                  id="is-public"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="is-public"
                  className="text-xs font-bold text-muted-foreground cursor-pointer select-none"
                >
                  Make this assessment public (visible on the public portal)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                      {editTarget ? "Updating..." : "Creating..."}
                    </>
                  ) : editTarget ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Assessment Tool"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
