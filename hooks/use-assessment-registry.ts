import { useQuery } from "@tanstack/react-query";
import { assessmentRegistryService } from "@/services/assessment-registry";
import { AssessmentRegistryData, PaginatedResponse } from "@/types/assessment-registry";

export function useAssessmentRegistry(page: number) {
  return useQuery<PaginatedResponse<AssessmentRegistryData>>({
    queryKey: ["assessment-registry-list", page],
    queryFn: () => assessmentRegistryService.list(page),
    placeholderData: (previousData) => previousData,
  });
}
