import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report";
import { ReportData } from "@/types/admin/report";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminReports(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<ReportData>>({
    queryKey: ["admin-reports-list", page, token, search],
    queryFn: () => reportService.listAdmin(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}
