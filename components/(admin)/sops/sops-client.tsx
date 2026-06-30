"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  X,
  Eye,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useAdminSops } from "@/hooks/use-admin-sops";
import { useDebounce } from "@/hooks/use-debounce";
import { sopService } from "@/services/sop";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { FileUpload } from "@/components/shared/file-upload";
import Link from "next/link";

export default function SOPsClient() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal / Upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Verification & Versioning state
  const [reverifyTarget, setReverifyTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [uploadNewTarget, setUploadNewTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedNewFile, setSelectedNewFile] = useState<File | null>(null);

  // Permission Flags
  const isSuperAdmin = user?.role === "Superadmin";
  const isViewer = user?.role === "Viewer";
  const canAdd = isSuperAdmin || (!isViewer && !!user?.role);
  const canDelete = isSuperAdmin;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch SOP list
  const { data, isLoading, isPlaceholderData, error } = useAdminSops(
    page,
    token,
    debouncedSearch,
  );
  const sopsList = data?.results || [];

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadName.trim()) throw new Error("Please enter a name");
      return sopService.create(
        uploadName,
        uploadDescription,
        selectedFile,
        token,
        true,
      );
    },
    onSuccess: () => {
      toast.success("SOP document uploaded successfully!");
      setIsUploadOpen(false);
      setUploadName("");
      setUploadDescription("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload SOP document");
    },
  });

  // Reverify mutation
  const reverifyMutation = useMutation({
    mutationFn: async (id: number) => {
      return sopService.reverify(id, token);
    },
    onSuccess: () => {
      toast.success("SOP status reverted to unverified!");
      setReverifyTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to revert SOP status");
      setReverifyTarget(null);
    },
  });

  // Upload new version mutation
  const uploadNewMutation = useMutation({
    mutationFn: async () => {
      if (!uploadNewTarget) throw new Error("No target selected");
      if (!selectedNewFile) throw new Error("Please select a file to upload");

      // 1. PATCH the file
      const updated = await sopService.updateFile(
        uploadNewTarget.id,
        selectedNewFile,
        token,
      );

      // 2. Call reverify to reset status and notify
      await sopService.reverify(uploadNewTarget.id, token);

      return updated;
    },
    onSuccess: () => {
      toast.success("New version uploaded and submitted for verification!");
      setUploadNewTarget(null);
      setSelectedNewFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload new version");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return sopService.delete(id, token);
    },
    onSuccess: () => {
      toast.success("SOP document deleted successfully!");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete SOP document");
      setDeleteTarget(null);
    },
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <PageHeader
          title="Standard Operating Procedures (SOPs)"
          description={
            <div className="flex flex-col gap-0.5">
              <span>
                Manage official cluster guidelines, standards, and operational
                guidelines
              </span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total records
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="cursor-pointer font-bold"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Upload SOP
              </Button>
            )
          }
        />

        {/* Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SOPs by name..."
              className="h-9 pl-9 w-full bg-background"
            />
          </div>
        </div>

        {/* Loading / Error / Empty / List Grid */}
        <div className="relative min-h-[200px]">
          {isLoading || isPlaceholderData ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted rounded-xl w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load SOP documents: {(error as Error).message}
            </div>
          ) : sopsList.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={`No SOPs found`}
              description={
                canAdd
                  ? "Upload your first SOP document to publish guidelines."
                  : "No documents have been uploaded to this category yet."
              }
              action={
                canAdd ? (
                  <Button
                    onClick={() => setIsUploadOpen(true)}
                    className="cursor-pointer font-bold"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Upload SOP
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-[30%]">Document Name</th>
                    <th className="p-4 w-[20%]">Description</th>
                    <th className="p-4 w-[15%]">Published Date</th>
                    <th className="p-4 w-[15%]">Status</th>
                    <th className="p-4 w-[20%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {sopsList.map((item) => {
                    const formattedDate = item.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4 font-bold text-foreground">
                          <span className="truncate max-w-xs block">
                            {item.name}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground max-w-xs truncate font-medium">
                          {item.description || "—"}
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold">
                          {formattedDate}
                        </td>
                        <td className="p-4">
                          {item.status === "verified" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          ) : item.status === "returned" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                              <AlertTriangle className="w-3 h-3" /> Returned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              <Clock className="w-3 h-3" /> Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {item.file && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold cursor-pointer gap-1"
                                onClick={() =>
                                  window.open(getFileUrl(item.file), "_blank")
                                }
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </Button>
                            )}
                            {isSuperAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold cursor-pointer gap-1"
                                asChild
                              >
                                <Link href={`/sops/verify/${item.id}`}>
                                  Review
                                </Link>
                              </Button>
                            )}
                            {canAdd && item.status === "returned" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={reverifyMutation.isPending}
                                className="h-8 px-2.5 font-bold cursor-pointer gap-1 hover:bg-muted"
                                onClick={() =>
                                  setReverifyTarget({
                                    id: item.id,
                                    name: item.name,
                                  })
                                }
                              >
                                {reverifyMutation.isPending ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-3.5 h-3.5" />
                                )}
                                Verify
                              </Button>
                            )}
                            {canAdd && item.status !== "verified" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold cursor-pointer gap-1 hover:bg-muted"
                                onClick={() =>
                                  setUploadNewTarget({
                                    id: item.id,
                                    name: item.name,
                                  })
                                }
                              >
                                <Upload className="w-3.5 h-3.5" /> Upload New
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border/80 cursor-pointer gap-1"
                                onClick={() => handleDelete(item.id, item.name)}
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
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

        {/* Pagination */}
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

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Upload SOP Document
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUploadOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Document Title
                </label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Vanuatu Evacuation SOP 2026"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Summarize standard operating procedures and target sectors..."
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Select File (PDF, Excel, Word, etc.)
                </label>
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                  helperText="Drag & drop file here or click to browse"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reverify confirmation */}
      <AlertDialog
        isOpen={!!reverifyTarget}
        onClose={() => setReverifyTarget(null)}
        onConfirm={() => {
          if (reverifyTarget) {
            reverifyMutation.mutate(reverifyTarget.id);
          }
        }}
        title="Revert Verification Status"
        description={`Are you sure you want to request reverification for "${reverifyTarget?.name}"?`}
        confirmText="Verify"
        pendingText="Verifying..."
        variant="default"
        isPending={reverifyMutation.isPending}
      />

      {/* Delete confirmation */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete SOP Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />

      {/* Upload New Version Modal */}
      {uploadNewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Upload New Version
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setUploadNewTarget(null);
                  setSelectedNewFile(null);
                }}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-bold text-foreground">
                Uploading a new version for "{uploadNewTarget.name}"
              </p>
              <p>
                Need to submit a revised file? Uploading a new file will
                automatically reset this document's status to unverified for
                verification.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadNewMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Select File
                </label>
                <FileUpload
                  selectedFile={selectedNewFile}
                  onFileSelect={setSelectedNewFile}
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
                  helperText="Drag & drop new file here or click to browse"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUploadNewTarget(null);
                    setSelectedNewFile(null);
                  }}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadNewMutation.isPending || !selectedNewFile}
                  className="h-9 font-bold cursor-pointer"
                >
                  {uploadNewMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                      Uploading...
                    </>
                  ) : (
                    "Upload Version"
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
