import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/report";
import { ReportData } from "@/types/admin/report";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminReports(
  page: number,
  token: string | null,
  search?: string
) {
  return useQuery<PaginatedResponse<ReportData>>({
    queryKey: ["admin-reports-list", page, token, search],
    queryFn: () => reportService.listAdmin(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

export function useUploadReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      file,
      token,
    }: {
      name: string;
      file: File | null;
      token: string | null;
    }) => {
      const todayDate = new Date().toISOString().split("T")[0];
      return reportService.create(
        name,
        "situational",
        todayDate,
        file,
        null,
        null,
        token,
        true
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports-list"] });
    },
  });
}

export function useReverifyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      reportService.reverify(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports-list"] });
    },
  });
}

export function useUploadNewReport() {
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
      const updated = await reportService.updateFile(id, file, token);
      await reportService.reverify(id, token);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports-list"] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      reportService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports-list"] });
    },
  });
}
