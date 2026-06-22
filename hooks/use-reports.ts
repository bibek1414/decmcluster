import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report";
import { ReportData } from "@/types/report";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useReports(page: number, search?: string) {
  return useQuery<PaginatedResponse<ReportData>>({
    queryKey: ["reports-list", page, search],
    queryFn: () => reportService.list(page, search),
    placeholderData: (previousData) => previousData,
  });
}
