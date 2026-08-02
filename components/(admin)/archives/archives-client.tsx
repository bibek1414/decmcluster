"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Archive,
  Trash2,
  Edit2,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  Loader2,
  Layers,
  Calendar,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminArchives,
  useCreateArchive,
  useUpdateArchive,
  useDeleteArchive,
} from "@/hooks/use-admin-archives";
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
import { ArchiveData } from "@/types/admin/archive";

export default function ArchivesClient() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArchive, setEditingArchive] = useState<ArchiveData | null>(null);

  // Form states
  const [surveyType, setSurveyType] = useState("");
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("");
  const [surveyTools, setSurveyTools] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // User permission check
  const isSuperAdmin = user?.role === "Superadmin";
  const isDataEnumerator = user?.role === "Data Enumerator";
  const isFieldCoordinator = user?.role === "Field Coordinator";
  const canModify = isSuperAdmin || isDataEnumerator || isFieldCoordinator;
  const canDelete = isSuperAdmin;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setDeleteTarget(null);
        setEditingArchive(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch archives query
  const { data, isLoading, isPlaceholderData, error } = useAdminArchives(page, token, debouncedSearch);
  const archivesList = data?.results || [];

  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Mutations
  const createMutation = useCreateArchive();
  const updateMutation = useUpdateArchive();
  const deleteMutation = useDeleteArchive();

  const handleOpenAddModal = () => {
    setEditingArchive(null);
    setSurveyType("");
    setDate("");
    setLevel("");
    setSurveyTools("");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (archive: ArchiveData) => {
    setEditingArchive(archive);
    setSurveyType(archive.survey_type || "");
    setDate(archive.date || "");
    setLevel(archive.level || "");
    setSurveyTools(archive.survery_tools || archive.survey_tools || "");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!surveyType.trim()) return toast.error("Please enter a Survey Type");
    if (!date.trim()) return toast.error("Please select a Date");
    if (!level.trim()) return toast.error("Please specify a Level");

    const payload = {
      survey_type: surveyType,
      date,
      level,
      survery_tools: surveyTools,
      file: selectedFile,
    };

    if (editingArchive) {
      updateMutation.mutate(
        { id: editingArchive.id, payload, token },
        {
          onSuccess: () => {
            toast.success("Archive entry updated successfully!");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to update archive entry");
          },
        },
      );
    } else {
      createMutation.mutate(
        { payload, token },
        {
          onSuccess: () => {
            toast.success("Archive entry created successfully!");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to create archive entry");
          },
        },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(
        { id: deleteTarget.id, token },
        {
          onSuccess: () => {
            toast.success("Archive entry deleted successfully!");
            setDeleteTarget(null);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to delete archive entry");
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
          title="Survey & Displacement Archives"
          description={
            <div className="flex flex-col gap-0.5">
              <span>Repository of survey records, tools, and archived displacement datasets</span>
              {data && (
                <span className="text-xs text-muted-foreground/80 font-normal mt-0.5 block">
                  {data.count} total archive records
                </span>
              )}
            </div>
          }
          actions={
            canModify && (
              <Button onClick={handleOpenAddModal} className="cursor-pointer font-bold gap-1.5">
                <Plus className="h-4 w-4" /> Add Archive
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
              placeholder="Search archives by survey type, tools, or level..."
              className="h-9 pl-9 w-full bg-background"
            />
          </div>
        </div>

        {/* Loading / Error / Empty / List */}
        <div className="relative min-h-[200px]">
          {isLoading || isPlaceholderData ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-medium dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
              Failed to load archives: {(error as Error).message}
            </div>
          ) : archivesList.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="No archives found"
              description={
                canModify
                  ? "Create your first archive entry to store survey tools and files."
                  : "No archive documents have been registered yet."
              }
              action={
                canModify ? (
                  <Button onClick={handleOpenAddModal} className="cursor-pointer font-bold gap-1.5">
                    <Plus className="h-4 w-4" /> Add Archive
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="p-4 w-[25%]">Survey Type</th>
                    <th className="p-4 w-[12%]">Date</th>
                    <th className="p-4 w-[13%]">Level</th>
                    <th className="p-4 w-[28%]">Survey Tools</th>
                    <th className="p-4 w-[12%]">File</th>
                    <th className="p-4 w-[10%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {archivesList.map((item) => {
                    const toolsText = item.survery_tools || item.survey_tools || "";
                    const toolsList = toolsText
                      .split(/\r?\n/)
                      .map((t) => t.trim())
                      .filter(Boolean);

                    const formattedDate = item.date
                      ? new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A";

                    return (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            <Archive className="h-4 w-4 text-primary shrink-0" />
                            <span className="truncate">{item.survey_type}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground font-semibold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 capitalize">
                            <Layers className="h-3 w-3" />
                            {item.level}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {toolsList.length > 0 ? (
                            <div className="space-y-1">
                              {toolsList.slice(0, 2).map((tool, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/90 truncate"
                                >
                                  <Wrench className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                                  <span className="truncate">{tool}</span>
                                </div>
                              ))}
                              {toolsList.length > 2 && (
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  +{toolsList.length - 2} more tools
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 italic">None listed</span>
                          )}
                        </td>
                        <td className="p-4">
                          {item.file ? (
                            <a
                              href={getFileUrl(item.file)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          ) : (
                            <span className="text-muted-foreground/50 italic text-[11px]">
                              No file
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            {canModify && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                                onClick={() => handleOpenEditModal(item)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                                onClick={() => setDeleteTarget({ id: item.id, name: item.survey_type })}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-lg p-6 rounded-2xl space-y-4 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {editingArchive ? "Edit Archive Record" : "Add New Archive Record"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Survey Type <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={surveyType}
                  onChange={(e) => setSurveyType(e.target.value)}
                  placeholder="e.g. Durable Solutions (IOM)"
                  className="w-full bg-background"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-muted-foreground">
                    Level <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. Community, Household, National"
                    className="w-full bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Survey Tools (One per line)
                </label>
                <textarea
                  value={surveyTools}
                  onChange={(e) => setSurveyTools(e.target.value)}
                  placeholder={"Displaced Household Registration form\r\nHost Household Reporting Form"}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Archive File (PDF, Excel, Word, CSV, ZIP)
                </label>
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.zip,.rar"
                  helperText={
                    editingArchive?.file
                      ? "File attached. Upload a new file to replace it."
                      : "Drag & drop archive file here or click to browse"
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 cursor-pointer text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="h-9 font-bold cursor-pointer text-xs gap-1.5"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : editingArchive ? (
                    "Update Archive"
                  ) : (
                    "Create Archive"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Archive Record"
        description={`Are you sure you want to delete the archive record "${deleteTarget?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
