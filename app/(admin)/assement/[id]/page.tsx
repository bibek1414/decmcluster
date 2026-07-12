"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileSpreadsheet,
  Trash2,
  Clock,
  Plus,
  X,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  useAssessment,
  useAssessmentResults,
  useDeleteAssessment,
  useCreateAssessmentResult,
  useDeleteAssessmentResult,
} from "@/hooks/use-assessments";
import { FileUpload } from "@/components/shared/file-upload";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const slug = params.id as string;

  // Modals & Upload State
  const [isResultUploadOpen, setIsResultUploadOpen] = useState(false);
  const [resultTitle, setResultTitle] = useState("");
  const [resultDesc, setResultDesc] = useState("");
  const [resultFile, setResultFile] = useState<File | null>(null);

  // Deletion States
  const [assessmentToDelete, setAssessmentToDelete] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<number | null>(null);

  // Role permissions
  const isSuperAdmin = user?.role === "Superadmin";
  const isDataEnumerator = user?.role === "Data Enumerator";
  const isFieldCoordinator = user?.role === "Field Coordinator";
  const canAdd = isSuperAdmin || isDataEnumerator || isFieldCoordinator;
  const canDelete = isSuperAdmin;

  // Base URL translation
  const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
  const getFileUrl = (urlPath?: string | null) => {
    if (!urlPath) return "";
    if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
      return urlPath;
    }
    return `${baseUrl}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
  };

  // Queries
  const {
    data: assessment,
    isLoading: isAssessmentLoading,
    error: assessmentError,
  } = useAssessment(slug);

  const {
    data: results = [],
    isLoading: isResultsLoading,
    error: resultsError,
  } = useAssessmentResults(slug, token);

  // Mutations
  const deleteAssessmentMutation = useDeleteAssessment();
  const uploadResultMutation = useCreateAssessmentResult();
  const deleteResultMutation = useDeleteAssessmentResult();

  if (isAssessmentLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-card border border-border rounded-2xl shadow-sm p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold mt-4">
            Loading assessment details...
          </p>
        </div>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">
            Assessment Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The assessment with slug{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
              {slug}
            </code>{" "}
            may have been deleted, moved, or the API is unreachable.
          </p>
          <Button asChild className="mt-2 font-bold cursor-pointer">
            <Link href="/assement">Back to assessments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const createdDate = assessment.created_at
    ? new Date(assessment.created_at).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultTitle.trim()) {
      toast.error("Please enter a title for the result");
      return;
    }
    if (!resultFile) {
      toast.error("Please select a file to upload");
      return;
    }
    uploadResultMutation.mutate(
      {
        slug,
        title: resultTitle,
        description: resultDesc,
        file: resultFile,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Result uploaded successfully");
          setIsResultUploadOpen(false);
          setResultTitle("");
          setResultDesc("");
          setResultFile(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to upload result");
        },
      }
    );
  };

  const handleConfirmDeleteAssessment = () => {
    deleteAssessmentMutation.mutate(
      { slug, token },
      {
        onSuccess: () => {
          toast.success("Assessment deleted successfully");
          router.push("/assement");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete assessment");
        },
      }
    );
  };

  const handleConfirmDeleteResult = () => {
    if (resultToDelete !== null) {
      deleteResultMutation.mutate(
        { slug, resultId: resultToDelete, token },
        {
          onSuccess: () => {
            toast.success("Result deleted successfully");
            setResultToDelete(null);
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to delete result");
          },
        }
      );
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <Link
          href="/assement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All assessments
        </Link>

        <PageHeader
          title={assessment.name}
          description={assessment.description || "No description provided."}
          actions={
            <div className="flex flex-wrap gap-2">
              {assessment.pdf && (() => {
                const isCsv = assessment.pdf.toLowerCase().endsWith(".csv") || assessment.pdf.toLowerCase().endsWith(".xlsx") || assessment.pdf.toLowerCase().endsWith(".xls");
                const label = isCsv ? "Download Excel/CSV Template" : "Download PDF/Doc Template";
                const IconComponent = isCsv ? FileSpreadsheet : FileText;
                const iconColor = isCsv ? "text-green-600" : "text-blue-600";
                return (
                  <Button
                    asChild
                    variant="outline"
                    className="cursor-pointer font-bold h-9"
                  >
                    <a
                      href={getFileUrl(assessment.pdf)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className={`mr-1.5 h-4 w-4 ${iconColor}`} />{" "}
                      {label}
                    </a>
                  </Button>
                );
              })()}
              {assessment.excel && (
                <Button
                  asChild
                  variant="outline"
                  className="cursor-pointer font-bold h-9"
                >
                  <a
                    href={getFileUrl(assessment.excel)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileSpreadsheet className="mr-1.5 h-4 w-4 text-green-600" />{" "}
                    Download Excel Form
                  </a>
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAssessmentToDelete(true)}
                  className="text-destructive hover:bg-destructive/10 h-9 w-9 rounded-lg cursor-pointer"
                  title="Delete Assessment"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailStat
            icon={Calendar}
            label="Created Date"
            value={createdDate}
          />

          <DetailStat
            icon={FileText}
            label="Results Count"
            value={`${results.length} files uploaded`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left panel: List of uploaded result datasets */}
          <Card className="p-5 lg:col-span-2 border border-border bg-card space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Uploaded Assessment Results / Reports
              </h3>
              {canAdd && (
                <Button
                  onClick={() => setIsResultUploadOpen(true)}
                  className="h-8 text-xs font-bold gap-1 cursor-pointer"
                  size="sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload Result
                </Button>
              )}
            </div>

            {isResultsLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-xl w-full" />
                ))}
              </div>
            ) : resultsError ? (
              <div className="p-4 border border-red-200/50 bg-red-50/50 text-red-700 text-xs rounded-xl font-semibold">
                Failed to load results: {(resultsError as Error).message}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <FileText className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs font-bold text-foreground">
                  No results uploaded yet
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Upload reports, findings, or dataset files for this assessment
                  tool.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result) => {
                  const resultDate = result.created_at
                    ? new Date(result.created_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A";

                  return (
                    <div
                      key={result.id}
                      className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-foreground/10 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-foreground truncate block">
                            {result.title}
                          </span>
                          <span className="text-[9px] text-muted-foreground whitespace-nowrap bg-muted/60 px-1.5 py-0.5 rounded font-semibold">
                            {resultDate}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {result.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {result.file && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-bold gap-1 cursor-pointer"
                            asChild
                          >
                            <a
                              href={getFileUrl(result.file)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-3.5 h-3.5" /> Download File
                            </a>
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-border/80 cursor-pointer"
                            onClick={() => setResultToDelete(result.id)}
                            title="Delete Result File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Right panel: Sidebar template controls */}
          <div className="space-y-4">
            <Card className="p-5 border border-border bg-card space-y-4">
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Offline Templates
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Download templates for local surveys or paper-based field data
                collections.
              </p>
              <div className="space-y-2.5">
                {assessment.pdf ? (() => {
                  const isCsv = assessment.pdf.toLowerCase().endsWith(".csv") || assessment.pdf.toLowerCase().endsWith(".xlsx") || assessment.pdf.toLowerCase().endsWith(".xls");
                  const label = isCsv ? "Excel/CSV Template" : "PDF/Doc Template";
                  const IconComponent = isCsv ? FileSpreadsheet : FileText;
                  const iconColor = isCsv ? "text-green-600" : "text-blue-600";
                  return (
                    <a
                      href={getFileUrl(assessment.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-xs font-bold text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${iconColor}`} /> {label}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  );
                })() : (
                  <div className="p-3 text-center rounded-xl border border-border border-dashed text-[10px] text-muted-foreground font-semibold">
                    No PDF/CSV Form Available
                  </div>
                )}

                {assessment.excel ? (
                  <a
                    href={getFileUrl(assessment.excel)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-xs font-bold text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />{" "}
                      Excel Version
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ) : (
                  <div className="p-3 text-center rounded-xl border border-border border-dashed text-[10px] text-muted-foreground font-semibold">
                    No Excel Form Available
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Result Upload Modal */}
      {isResultUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-md p-6 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Upload Assessment Result
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsResultUploadOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Title
                </label>
                <Input
                  value={resultTitle}
                  onChange={(e) => setResultTitle(e.target.value)}
                  placeholder="e.g. Q1 Evacuation Center Survey Report"
                  className="w-full bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={resultDesc}
                  onChange={(e) => setResultDesc(e.target.value)}
                  placeholder="Describe the findings or content of this file..."
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-muted-foreground">
                  File (PDF, Excel, CSV, Word, Image, etc.)
                </label>
                <FileUpload
                  selectedFile={resultFile}
                  onFileSelect={setResultFile}
                  accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.png,.jpg,.jpeg"
                  helperText="Drag & drop result file here or click to browse"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResultUploadOpen(false)}
                  className="h-9 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadResultMutation.isPending}
                  className="h-9 font-bold cursor-pointer"
                >
                  {uploadResultMutation.isPending ? (
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

      {/* Assessment Deletion Confirmation Modal */}
      {assessmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-sm p-6 rounded-xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">
              Delete Assessment
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete assessment tool{" "}
              <span className="font-extrabold text-foreground">
                "{assessment.name}"
              </span>
              ? This will permanently delete this tool and all uploaded results.
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setAssessmentToDelete(false)}
                className="h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteAssessment}
                disabled={deleteAssessmentMutation.isPending}
                className="h-9 font-bold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteAssessmentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Result Deletion Confirmation Modal */}
      {resultToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-sm p-6 rounded-xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">
              Delete Result File
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete this result file? This action
              cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setResultToDelete(null)}
                className="h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteResult}
                disabled={deleteResultMutation.isPending}
                className="h-9 font-bold cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteResultMutation.isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="truncate text-xs font-bold text-foreground mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
