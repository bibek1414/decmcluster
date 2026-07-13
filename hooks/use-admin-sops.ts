import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sopService } from "@/services/sop";
import { SOPData } from "@/types/admin/sop";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminSops(
  page: number,
  token: string | null,
  search?: string
) {
  return useQuery<PaginatedResponse<SOPData>>({
    queryKey: ["admin-sops-list", page, token, search],
    queryFn: () => sopService.listAdmin(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadSop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
      file,
      token,
    }: {
      name: string;
      description: string;
      file: File | null;
      token: string | null;
    }) => sopService.create(name, description, file, token, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
  });
}

export function useReverifySop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      sopService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
  });
}

export function useUploadNewSop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      file,
      token,
    }: {
      id: number;
      file: File;
      token: string | null;
    }) => {
      const updated = await sopService.updateFile(id, file, token);
      await sopService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
  });
}

export function useDeleteSop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      sopService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sops-list"] });
    },
  });
}
