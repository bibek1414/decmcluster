import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { villageAssessmentImportService } from "@/services/village-assessment-import";
import { VillageAssessmentImportData } from "@/types/admin/village-assessment-import";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useVillageAssessmentImports(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<VillageAssessmentImportData>>({
    queryKey: ["village-assessment-imports-list", page, token, search],
    queryFn: () => villageAssessmentImportService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadVillageAssessmentImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file, token }: { name: string; file: File; token: string | null }) =>
      villageAssessmentImportService.create(name, file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-assessment-imports-list"] });
    },
  });
}

export function useDeleteVillageAssessmentImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      villageAssessmentImportService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-assessment-imports-list"] });
    },
  });
}

export function useReverifyVillageAssessmentImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      villageAssessmentImportService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-assessment-imports-list"] });
    },
  });
}

export function useUploadNewVillageAssessmentImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, token }: { id: number; file: File; token: string | null }) => {
      const updated = await villageAssessmentImportService.updateFile(id, file, token);
      await villageAssessmentImportService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["village-assessment-imports-list"] });
    },
  });
}
