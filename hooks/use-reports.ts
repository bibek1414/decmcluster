import { useQuery } from "@tanstack/react-query";
import { reportService, ReportData } from "@/services/report";

export function useReports() {
  return useQuery<ReportData[]>({
    queryKey: ["reports-list"],
    queryFn: () => reportService.list(),
  });
}
