"use client";

import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Download, Plus, Trash2, X, Eye, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-reports";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";
import { Pagination } from "@/components/shared/pagination";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { reportService } from "@/services/report";
import { FileUpload } from "@/components/shared/file-upload";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ReportsClient() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal / Upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete State
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
  const { data, isLoading, isPlaceholderData, error } = useReports(
    page,
    debouncedSearch,
  );

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadName.trim()) throw new Error("Please enter a name");
      if (!selectedFile) throw new Error("Please select a file to upload");
      
      const todayDate = new Date().toISOString().split("T")[0];
      return reportService.create(
        uploadName,
        "situational",
        todayDate,
        selectedFile,
        null,
        token
      );
    },
    onSuccess: () => {
      toast.success("Report uploaded successfully!");
      setIsUploadOpen(false);
      setUploadName("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload report");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return reportService.delete(id, token);
    },
    onSuccess: () => {
      toast.success("Report deleted successfully!");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["reports-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete report");
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

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  const reportsList = data?.results || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Situation Reports & Publications
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Download monthly sitreps and displacement trackers
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-center">
          {data && (
            <span className="text-xs text-muted-foreground font-semibold bg-muted/50 border border-border px-3 py-1 rounded-full shrink-0">
              Total Publications:{" "}
              <strong className="text-foreground font-extrabold">
                {data.count}
              </strong>
            </span>
          )}
          {canAdd && (
            <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold h-9">
              <Plus className="mr-1.5 h-4 w-4" /> Upload Report
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">
            Available Publications
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search reports..."
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
              <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-foreground">
                  Updating...
                </span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 h-[72px]"
                >
                  <div className="space-y-2 w-2/3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-muted rounded w-28 shrink-0" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load reports: {(error as Error).message}
            </div>
          ) : reportsList.length > 0 ? (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="divide-y divide-border">
                {reportsList.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground">
                          {rep.name}
                        </h4>
                        {rep.type && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white border border-primary">
                            {rep.type}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Published: {rep.date || formatDate(rep.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {rep.file && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer font-bold flex items-center gap-1.5"
                          asChild
                        >
                          <a href={getFileUrl(rep.file)} download={rep.name}>
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                          </a>
                        </Button>
                      )}
                      {rep.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer font-bold flex items-center gap-1.5"
                          asChild
                        >
                          <a
                            href={rep.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open Link
                          </a>
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer font-bold flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border/80"
                          onClick={() => handleDelete(rep.id, rep.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reusable Pagination footer */}
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
              <h3 className="text-base font-bold text-foreground">Upload Report / Publication</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUploadOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground animate-none"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Document Title</label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Displacement Tracking Matrix - Oct 2026"
                  className="w-full bg-background text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Select File</label>
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
        title="Delete Report"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
