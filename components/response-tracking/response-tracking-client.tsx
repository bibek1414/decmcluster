"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Download,
  FileSpreadsheet,
  FileText,
  BarChart3,
  Plus,
  Trash2,
  X,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResponseTracking } from "@/hooks/use-response-tracking";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/config/site";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { responseTrackingService } from "@/services/response-tracking";
import { FileUpload } from "@/components/shared/file-upload";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ResponseTrackingClient() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");

  // Modal / Upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Permission Flags
  const isSuperAdmin = user?.role === "Superadmin";
  const isViewer = user?.role === "Viewer";
  const canAdd = isSuperAdmin || (!isViewer && !!user?.role);
  const canDelete = isSuperAdmin;

  const { data: trackingList, isLoading, error } = useResponseTracking(debouncedSearch);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadName.trim()) throw new Error("Please enter a name");
      if (!selectedFile) throw new Error("Please select a file to upload");
      return responseTrackingService.create(uploadName, selectedFile, token);
    },
    onSuccess: () => {
      toast.success("Response tracking tool uploaded successfully!");
      setIsUploadOpen(false);
      setUploadName("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["response-tracking-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload response tracking tool");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return responseTrackingService.delete(id, token);
    },
    onSuccess: () => {
      toast.success("Response tracking tool deleted successfully!");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["response-tracking-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete response tracking tool");
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

  const getFileExtension = (urlPath: string): string => {
    if (!urlPath) return "FILE";
    const parts = urlPath.split(".");
    const ext = parts[parts.length - 1];
    if (!ext) return "FILE";
    const cleanExt = ext.split(/[?#]/)[0].toUpperCase();
    return cleanExt;
  };

  const getFormatIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case "XLS":
      case "XLSX":
        return FileSpreadsheet;
      case "PPT":
      case "PPTX":
        return BarChart3;
      default:
        return FileText;
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

  const items = trackingList || [];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Response Tracking</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sector-wide reporting templates and field response data
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-center">
          {canAdd && (
            <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold h-9">
              <Plus className="mr-1.5 h-4 w-4" /> Upload Template
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="text-xs font-bold text-muted-foreground">Available Templates & Tools</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs max-w-sm w-full sm:w-60 bg-background"
            />
          </div>
        </div>

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
            Failed to load response tracking data: {(error as Error).message}
          </div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
            {items.map((item) => {
              const format = getFileExtension(item.file);
              const Icon = getFormatIcon(format);
              return (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl border mt-0.5 bg-primary/10 border-primary/20 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Updated: {formatDate(item.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm" className="shrink-0 cursor-pointer font-bold">
                      <a href={getFileUrl(item.file)} download className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" />
                        Download {format}
                      </a>
                    </Button>
                    {canDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer font-bold flex items-center gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-border/80"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border border-border rounded-xl bg-card text-xs">
            No data available
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Upload Response Tracking Tool</h3>
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
                  placeholder="e.g. 5W Response Tracking Template"
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
        title="Delete Response Tracking Tool"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
