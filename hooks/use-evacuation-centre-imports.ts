import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { evacuationCentreImportService } from "@/services/evacuation-centre-import";
import { EvacuationCentreImportData } from "@/types/admin/evacuation-centre-import";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useEvacuationCentreImports(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<EvacuationCentreImportData>>({
    queryKey: ["evacuation-centre-imports-list", page, token, search],
    queryFn: () => evacuationCentreImportService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadEvacuationCentreImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file, token }: { name: string; file: File; token: string | null }) =>
      evacuationCentreImportService.create(name, file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuation-centre-imports-list"] });
    },
  });
}

export function useDeleteEvacuationCentreImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      evacuationCentreImportService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuation-centre-imports-list"] });
    },
  });
}

export function useReverifyEvacuationCentreImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      evacuationCentreImportService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuation-centre-imports-list"] });
    },
  });
}

export function useUploadNewEvacuationCentreImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, token }: { id: number; file: File; token: string | null }) => {
      const updated = await evacuationCentreImportService.updateFile(id, file, token);
      await evacuationCentreImportService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuation-centre-imports-list"] });
    },
  });
}
