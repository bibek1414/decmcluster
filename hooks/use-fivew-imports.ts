import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fiveWImportService } from "@/services/fivew-import";
import { FiveWImportData } from "@/types/admin/fivew-import";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useFiveWImports(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<FiveWImportData>>({
    queryKey: ["fivew-imports-list", page, token, search],
    queryFn: () => fiveWImportService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadFiveWImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file, token }: { name: string; file: File; token: string | null }) =>
      fiveWImportService.create(name, file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fivew-imports-list"] });
    },
  });
}

export function useDeleteFiveWImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      fiveWImportService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fivew-imports-list"] });
    },
  });
}

export function useReverifyFiveWImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      fiveWImportService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fivew-imports-list"] });
    },
  });
}

export function useUploadNewFiveWImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, token }: { id: number; file: File; token: string | null }) => {
      const updated = await fiveWImportService.updateFile(id, file, token);
      await fiveWImportService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fivew-imports-list"] });
    },
  });
}
