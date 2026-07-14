"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSops } from "@/hooks/use-sops";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";
import { Pagination } from "@/components/shared/pagination";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { sopService } from "@/services/sop";
import { FileUpload } from "@/components/shared/file-upload";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SopsClient() {
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
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Permission Flags
  const isSuperAdmin = user?.role === "Superadmin";
  const isViewer = user?.role === "Viewer";
  const canAdd = isSuperAdmin || (!isViewer && !!user?.role);
  const canDelete = isSuperAdmin;

  // Reset to first page when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const { data, isLoading, isPlaceholderData, error } = useSops(page, debouncedSearch);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadName.trim()) throw new Error("Please enter a name");
      return sopService.create(uploadName, uploadDescription, selectedFile, token);
    },
    onSuccess: () => {
      toast.success("SOP document uploaded successfully!");
      setIsUploadOpen(false);
      setUploadName("");
      setUploadDescription("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["sops-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload SOP document");
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
      queryClient.invalidateQueries({ queryKey: ["sops-list"] });
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

  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("collection") || lower.includes("survey") || lower.includes("form"))
      return ClipboardList;
    if (
      lower.includes("validation") ||
      lower.includes("workflow") ||
      lower.includes("approval") ||
      lower.includes("check")
    )
      return ShieldCheck;
    if (lower.includes("role") || lower.includes("setting") || lower.includes("management"))
      return Settings;
    return BookOpen;
  };

  const sopsList = data?.results || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Standard Operating Procedures
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Core operating guidelines and disaster management templates
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-center">
          {data && (
            <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0">
              Total SOPs: <strong className="text-foreground font-extrabold">{data.count}</strong>
            </span>
          )}
          {canAdd && (
            <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold h-9">
              <Plus className="mr-1.5 h-4 w-4" /> Upload SOP
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">Available Documents</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search SOPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs max-w-sm w-full sm:w-60 bg-background"
            />
          </div>
        </div>

        <div className="relative">
          {/* Active page change loading overlay */}
          {isPlaceholderData && (
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity animate-fadeIn">
              <div className="bg-card border border-border px-3 py-1.5 rounded-lg -sm flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-foreground">Updating...</span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border bg-card space-y-4 h-[180px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load SOP documents: {(error as Error).message}
            </div>
          ) : sopsList.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sopsList.map((sop) => {
                  const Icon = getIcon(sop.name);
                  return (
                    <div
                      key={sop.id}
                      className="p-5 rounded-xl border border-border flex flex-col justify-between gap-4 transition-all duration-200 -sm relative"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="p-2.5 rounded-lg bg-card border border-border w-fit mb-3 text-primary">
                            <Icon className="w-5 h-5" />
                          </div>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                              onClick={() => handleDelete(sop.id, sop.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-foreground">{sop.name}</h3>
                        {sop.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                            {sop.description}
                          </p>
                        )}
                      </div>
                      {sop.file && (
                        <a
                          href={getFileUrl(sop.file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary font-extrabold hover:underline text-left cursor-pointer inline-flex items-center gap-1 w-fit"
                        >
                          Read SOP Document <ChevronRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reusable Pagination */}
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
          ) : (
            <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Upload SOP Document</h3>
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
                  className="w-full bg-background text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Description</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Summarize standard operating procedures and target sectors..."
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
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
                  className="h-9 cursor-pointer text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="h-9 font-bold cursor-pointer text-xs"
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
        title="Delete SOP Document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
