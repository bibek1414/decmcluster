import { useQuery } from "@tanstack/react-query";
import { assessmentService, AssessmentData } from "@/services/assessment";

export function useAssessments() {
  return useQuery<AssessmentData[]>({
    queryKey: ["assessments-list"],
    queryFn: () => assessmentService.list(),
  });
}
