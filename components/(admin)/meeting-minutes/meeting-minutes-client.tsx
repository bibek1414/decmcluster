"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, FileText, Trash2, X, Eye, Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useMeetingMinutes } from "@/hooks/use-meeting-minutes";
import { useDebounce } from "@/hooks/use-debounce";
import { meetingMinuteService } from "@/services/meeting-minute";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { AlertDialog } from "@/components/ui/alert-dialog";

export default function MeetingMinutesClient() {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

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

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch meeting minutes list
  const { data, isLoading, isPlaceholderData, error } = useMeetingMinutes(page, token, debouncedSearch);
  const minutesList = data?.results || [];

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
      if (!selectedFile) throw new Error("Please select a file to upload");
      return meetingMinuteService.create(uploadName, selectedFile, token);
    },
    onSuccess: () => {
      toast.success("Meeting minute uploaded successfully!");
      setIsUploadOpen(false);
      setUploadName("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to upload meeting minute");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return meetingMinuteService.delete(id, token);
    },
    onSuccess: () => {
      toast.success("Meeting minute deleted successfully!");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["meeting-minutes-list"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete meeting minute");
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
          title="Meeting Minutes"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Manage coordination meeting minutes, task guidelines, and partner circulars</span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total records
                </span>
              )}
            </div>
          }
          actions={
            canAdd && (
              <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold">
                <Plus className="mr-1.5 h-4 w-4" /> Upload Minute
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
              placeholder="Search meeting minutes by name..."
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
              Failed to load meeting minutes: {(error as Error).message}
            </div>
          ) : minutesList.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No meeting minutes found"
              description={
                canAdd
                  ? "Upload your first meeting minute document to share with the cluster."
                  : "No documents have been uploaded to the registry yet."
              }
              action={
                canAdd ? (
                  <Button onClick={() => setIsUploadOpen(true)} className="cursor-pointer font-bold">
                    <Plus className="mr-1.5 h-4 w-4" /> Upload Minute
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-[50%]">Document Name</th>
                    <th className="p-4 w-[25%]">Published Date</th>
                    <th className="p-4 w-[25%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {minutesList.map((item) => {
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
                        <td className="p-4 font-bold text-foreground">
                          <span className="truncate max-w-md block">{item.name}</span>
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold">{formattedDate}</td>
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
              <h3 className="text-base font-bold text-foreground">Upload Meeting Minute</h3>
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
                <label className="block text-xs font-bold text-muted-foreground">Document Title</label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. DECM Coordination Meeting Oct 2026"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">Select File (PDF, Excel, Word, etc.)</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-border file:text-xs file:font-bold file:bg-muted/50 file:text-foreground hover:file:bg-muted cursor-pointer"
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
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
        title="Delete Meeting Minute"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
