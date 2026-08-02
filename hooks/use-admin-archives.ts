import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveService } from "@/services/archive";
import { ArchiveData, ArchiveCreatePayload, ArchiveUpdatePayload } from "@/types/admin/archive";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminArchives(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<ArchiveData>>({
    queryKey: ["admin-archives-list", page, token, search],
    queryFn: () => archiveService.listAdmin(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useCreateArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: ArchiveCreatePayload;
      token: string | null;
    }) => archiveService.create(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-archives-list"] });
    },
  });
}

export function useUpdateArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      token,
    }: {
      id: number | string;
      payload: ArchiveUpdatePayload;
      token: string | null;
    }) => archiveService.update(id, payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-archives-list"] });
    },
  });
}

export function useDeleteArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number | string; token: string | null }) =>
      archiveService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-archives-list"] });
    },
  });
}
