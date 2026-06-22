import { useQuery } from "@tanstack/react-query";
import { assessmentStatsService } from "@/services/assessment-stats";
import { AssessmentStat } from "@/types/assessment-stats";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAssessmentStats() {
  return useQuery<PaginatedResponse<AssessmentStat>>({
    queryKey: ["assessment-stats"],
    queryFn: () => assessmentStatsService.list(),
  });
}
