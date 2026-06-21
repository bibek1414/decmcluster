import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report";
import { ReportData } from "@/types/report";

export function useReports() {
  return useQuery<ReportData[]>({
    queryKey: ["reports-list"],
    queryFn: () => reportService.list(),
  });
}
