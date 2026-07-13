"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileSpreadsheet,
  Trash2,
  Loader2,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/(admin)/assessment/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  useAssessment,
  useDeleteAssessment,
} from "@/hooks/use-assessments";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { DynamicDataTable } from "@/components/(admin)/assessment/dynamic-data-table";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const slug = params.id as string;

  // Deletion States
  const [assessmentToDelete, setAssessmentToDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAssessmentToDelete(false);
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

  // Mutations
  const deleteAssessmentMutation = useDeleteAssessment();

  if (isAssessmentLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-card border border-border rounded-2xl p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold mt-4">
            Loading details...
          </p>
        </div>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Displacement Data Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The displacement data with slug{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono">
              {slug}
            </code>{" "}
            may have been deleted, moved, or the API is unreachable.
          </p>
          <Button asChild className="mt-2 font-bold cursor-pointer">
            <Link href="/assement">Back to Displacement Data</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleConfirmDeleteAssessment = () => {
    deleteAssessmentMutation.mutate(
      { slug, token },
      {
        onSuccess: () => {
          toast.success("Deleted successfully");
          router.push("/assement");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to delete");
        },
      },
    );
  };

  const isDisplacement = slug === "displacement-tracking-matrix-form" || slug === "displacement-data";
  const displayTitle = (isDisplacement ? "Displacement Data" : assessment.name).replace(/\bForm\b/gi, "Data");

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <Link
          href="/assement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Displacement Data
        </Link>

        <PageHeader
          title={displayTitle}
          description={assessment.description || "No description provided."}
          actions={
            <div className="flex flex-wrap gap-2">
              {assessment.pdf &&
                (() => {
                  const isCsv =
                    assessment.pdf.toLowerCase().endsWith(".csv") ||
                    assessment.pdf.toLowerCase().endsWith(".xlsx") ||
                    assessment.pdf.toLowerCase().endsWith(".xls");
                  const label = isCsv
                    ? "Download Excel/CSV Template"
                    : "Download PDF/Doc Template";
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
                        <IconComponent
                          className={`mr-1.5 h-4 w-4 ${iconColor}`}
                        />{" "}
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

        <div className="space-y-4">
          {slug === "evacuation-centre-assessment-form" ||
          slug === "displacement-tracking-matrix-form" ||
          slug === "displacement-data" ? (
            <DynamicDataTable slug={slug} token={token} canEdit={canAdd} />
          ) : (
            <Card className="p-12 border border-dashed border-border bg-card/50 flex flex-col items-center justify-center text-center space-y-3 rounded-2xl min-h-[300px]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-bold text-foreground">
                  No data records available for now
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Interactive database tables are currently not configured for
                  this form.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Assessment Deletion Confirmation Modal */}
      {assessmentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-fadeIn"
          onClick={() => setAssessmentToDelete(false)}
        >
          <div
            className="bg-card border border-border w-full max-w-sm p-6 rounded-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-foreground">
              Delete Form Registry
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete form{" "}
              <span className="font-extrabold text-foreground">
                "{assessment.name}"
              </span>
              ? This will permanently delete this registry. This action cannot
              be undone.
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
    </div>
  );
}
