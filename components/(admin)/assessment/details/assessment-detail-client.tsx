"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, SlidersHorizontal, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useAssessment, useDeleteAssessment } from "@/hooks/use-assessments";
import { toast } from "sonner";
import { DynamicDataTable } from "@/components/(admin)/assessment/dynamic-data-table";

interface AssessmentDetailClientProps {
  slug: string;
}

export default function AssessmentDetailClient({ slug }: AssessmentDetailClientProps) {
  const router = useRouter();
  const { user, token } = useAuth();

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

  const FORM_NAMES: Record<string, string> = {
    "displacement-data": "Displacement Data",
    "evacuation-centre-assessment-form": "Evacuation Centre Data",
    "village-assessment": "Village Assessment Data",
    "5w-response-data": "5W Response Data",
    "durable-solution-relocation-survey": "Durable Solution & Relocation Survey",
    "service-monitoring-tool-2026": "Service Monitoring Tool 2026",
    "displacement-profile-phone-survey": "Displacement Profile - Phone Survey",
    "displacement-tracking-matrix-form": "Displacement Tracking Matrix Form",
    "rapid-assessment-form-area-council": "Rapid Assessment Form (Area Council)",
    "damage-assessment-form-community-v2": "Damage Assessment Form (Community V2)",
    "community-level-damage-assessment-form": "Community Level Damage Assessment Form",
  };

  const isStatic = !!FORM_NAMES[slug];

  // Queries
  const {
    data: fetchedAssessment,
    isLoading: isAssessmentLoading,
    error: assessmentError,
  } = useAssessment(isStatic ? "" : slug);

  const assessment = isStatic ? { name: FORM_NAMES[slug] } : fetchedAssessment;

  const displayTitle = assessment?.name || slug;

  // Mutations
  const deleteAssessmentMutation = useDeleteAssessment();

  if (isAssessmentLoading) {
    return (
      <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-card border border-border rounded-2xl p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-semibold mt-4">Loading details...</p>
        </div>
      </div>
    );
  }

  if (assessmentError || !assessment) {
    return (
      <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        <div className="bg-card border border-border rounded-2xl mx-auto max-w-md py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Displacement Data Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            The displacement data with slug{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono">{slug}</code> may have been
            deleted, moved, or the API is unreachable.
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
          toast.error(err.message || "Failed to delete assessment");
        },
      },
    );
  };

  return (
    <div className=" w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <Link
          href="/assement"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <div className="text-gray-900 text-xl">{displayTitle}</div>
        </Link>

        <div className="space-y-4">
          <DynamicDataTable slug={slug} token={token} canEdit={canAdd} />
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
            <h3 className="text-base font-bold text-foreground">Delete Form Registry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete form{" "}
              <span className="font-extrabold text-foreground">"{assessment.name}"</span>? This will
              permanently delete this registry. This action cannot be undone.
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
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Deleting...
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
