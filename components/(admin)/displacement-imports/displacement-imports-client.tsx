"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileSpreadsheet,
  Trash2,
  X,
  Eye,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useDisplacementImports,
  useUploadDisplacementImport,
  useDeleteDisplacementImport,
  useReverifyDisplacementImport,
  useUploadNewDisplacementImport,
} from "@/hooks/use-displacement-imports";
import { useDebounce } from "@/hooks/use-debounce";
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

export default function DisplacementImportsClient() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal / Upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
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
  const isDataEnumerator = user?.role === "Data Enumerator";
  const isFieldCoordinator = user?.role === "Field Coordinator";
  const canAdd = isSuperAdmin || isDataEnumerator || isFieldCoordinator;
  const canDelete = isSuperAdmin;

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUploadOpen(false);
        setUploadNewTarget(null);
        setDeleteTarget(null);
        setReverifyTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch displacement imports list
  const { data, isLoading, isPlaceholderData, error } = useDisplacementImports(
    page,
    token,
    debouncedSearch,
  );
  const importsList = data?.results || [];

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Mutations
  const uploadMutation = useUploadDisplacementImport();
  const deleteMutation = useDeleteDisplacementImport();
  const reverifyMutation = useReverifyDisplacementImport();
  const uploadNewMutation = useUploadNewDisplacementImport();

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return toast.error("Please enter a name");
    if (!selectedFile) return toast.error("Please select a file to upload");

    uploadMutation.mutate(
      {
        name: uploadName,
        file: selectedFile,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Displacement import file uploaded successfully!");
          setIsUploadOpen(false);
          setUploadName("");
          setSelectedFile(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to upload file");
        },
      },
    );
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(
        { id: deleteTarget.id, token },
        {
          onSuccess: () => {
            toast.success("Import entry deleted successfully!");
            setDeleteTarget(null);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to delete import entry");
            setDeleteTarget(null);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn relative">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <Link
          href="/assement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Displacement Data
        </Link>

        <PageHeader
          title="Displacement Imports"
          description={
            <div className="flex flex-col gap-0.5">
              <span>
                Upload, manage, and verify displacement registry spreadsheets
              </span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total imports
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold">
                <Plus className="mr-1.5 h-4 w-4" /> Upload Import File
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
              placeholder="Search imports by name..."
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
              Failed to load imports: {(error as Error).message}
            </div>
          ) : importsList.length === 0 ? (
            <EmptyState
              icon={FileSpreadsheet}
              title="No displacement imports found"
              description={
                canAdd
                  ? "Upload your first displacement Excel/CSV list to submit for verification."
                  : "No displacement list imports have been uploaded yet."
              }
              action={
                canAdd ? (
                  <Button
                    onClick={() => setIsUploadOpen(true)}
                    className="cursor-pointer font-bold"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Upload Import File
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-[10%]">S.N.</th>
                    <th className="p-4 w-[35%]">Document Name</th>
                    <th className="p-4 w-[20%]">Uploaded Date</th>
                    <th className="p-4 w-[15%]">Status</th>
                    <th className="p-4 w-[20%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {importsList.map((item, index) => {
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
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-semibold text-muted-foreground">
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="p-4 font-bold text-foreground">
                          <span className="truncate max-w-md block">{item.name}</span>
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold">{formattedDate}</td>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 font-bold cursor-pointer gap-1"
                              onClick={() => window.open(getFileUrl(item.file), "_blank")}
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Button>
                            {isSuperAdmin && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2.5 font-bold cursor-pointer gap-1"
                                asChild
                              >
                                <Link href={`/displacement-imports/verify/${item.id}`}>Review</Link>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Upload Displacement Import</h3>
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
                  Dataset Title / Import Name
                </label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Shefa Province Displacements July 2026"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Select File (Excel/CSV)
                </label>
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  accept=".xlsx,.xls,.csv"
                  helperText="Drag & drop Excel/CSV here or click to browse"
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
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Uploading...
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

      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Import Entry"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />

      <AlertDialog
        isOpen={!!reverifyTarget}
        onClose={() => setReverifyTarget(null)}
        onConfirm={() => {
          if (reverifyTarget) {
            reverifyMutation.mutate(
              { id: reverifyTarget.id, token },
              {
                onSuccess: () => {
                  toast.success("Import status reverted to unverified!");
                  setReverifyTarget(null);
                },
                onError: (err: any) => {
                  toast.error(err.message || "Failed to revert import status");
                  setReverifyTarget(null);
                },
              },
            );
          }
        }}
        title="Request Verification"
        description={`Are you sure you want to request verification for "${reverifyTarget?.name}"?`}
        confirmText="Verify"
        pendingText="Verifying..."
        variant="default"
        isPending={reverifyMutation.isPending}
      />

      {/* Upload New Version Modal */}
      {uploadNewTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setUploadNewTarget(null);
            setSelectedNewFile(null);
          }}
        >
          <div
            className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Upload New Version</h3>
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

            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Uploading a revised file for{" "}
                <strong className="text-foreground">"{uploadNewTarget.name}"</strong> will reset its
                status to <span className="font-bold text-amber-600">Unverified</span> for review.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Select File (Excel/CSV)
                </label>
                <FileUpload
                  selectedFile={selectedNewFile}
                  onFileSelect={setSelectedNewFile}
                  accept=".xlsx,.xls,.csv"
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
                  onClick={() => {
                    if (!selectedNewFile) return toast.error("Please select a file to upload");
                    if (!uploadNewTarget) return;
                    uploadNewMutation.mutate(
                      {
                        id: uploadNewTarget.id,
                        file: selectedNewFile,
                        token,
                      },
                      {
                        onSuccess: () => {
                          toast.success("New version uploaded and submitted for verification!");
                          setUploadNewTarget(null);
                          setSelectedNewFile(null);
                        },
                        onError: (err: any) => {
                          toast.error(err.message || "Failed to upload new version");
                        },
                      },
                    );
                  }}
                  disabled={!selectedNewFile || uploadNewMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {uploadNewMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
