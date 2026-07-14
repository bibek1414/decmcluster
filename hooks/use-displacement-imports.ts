import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { displacementImportService } from "@/services/displacement-import";
import { DisplacementImportData } from "@/types/admin/displacement-import";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useDisplacementImports(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<DisplacementImportData>>({
    queryKey: ["displacement-imports-list", page, token, search],
    queryFn: () => displacementImportService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadDisplacementImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, file, token }: { name: string; file: File; token: string | null }) =>
      displacementImportService.create(name, file, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displacement-imports-list"] });
    },
  });
}

export function useDeleteDisplacementImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      displacementImportService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displacement-imports-list"] });
    },
  });
}

export function useReverifyDisplacementImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      displacementImportService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displacement-imports-list"] });
    },
  });
}

export function useUploadNewDisplacementImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file, token }: { id: number; file: File; token: string | null }) => {
      const updated = await displacementImportService.updateFile(id, file, token);
      await displacementImportService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["displacement-imports-list"] });
    },
  });
}
