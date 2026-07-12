import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment";
import { AssessmentData, AssessmentResultData } from "@/types/assessment";

export function useAssessments() {
  return useQuery<AssessmentData[]>({
    queryKey: ["assessments-list"],
    queryFn: () => assessmentService.list(),
  });
}

export function useAssessment(slug: string) {
  return useQuery<AssessmentData>({
    queryKey: ["assessment-detail", slug],
    queryFn: () => assessmentService.get(slug),
    enabled: !!slug,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
      pdf,
      excel,
      isPublic,
      token,
    }: {
      name: string;
      description: string;
      pdf: File | null;
      excel: File | null;
      isPublic: boolean;
      token: string | null;
    }) =>
      assessmentService.create(name, description, pdf, excel, isPublic, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments-list"] });
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, token }: { slug: string; token: string | null }) =>
      assessmentService.delete(slug, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments-list"] });
    },
  });
}

export function useAssessmentResults(slug: string, token: string | null) {
  return useQuery<AssessmentResultData[]>({
    queryKey: ["assessment-results", slug, token],
    queryFn: () => assessmentService.listResults(slug, token),
    enabled: !!slug,
  });
}

export function useCreateAssessmentResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      title,
      description,
      file,
      token,
    }: {
      slug: string;
      title: string;
      description: string;
      file: File | null;
      token: string | null;
    }) =>
      assessmentService.createResult(slug, title, description, file, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assessment-results", variables.slug],
      });
    },
  });
}

export function useDeleteAssessmentResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      resultId,
      token,
    }: {
      slug: string;
      resultId: number;
      token: string | null;
    }) => assessmentService.deleteResult(slug, resultId, token),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assessment-results", variables.slug],
      });
    },
  });
}
