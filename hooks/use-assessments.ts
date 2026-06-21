import { useQuery } from "@tanstack/react-query";
import { assessmentService } from "@/services/assessment";
import { AssessmentData } from "@/types/assessment";

export function useAssessments() {
  return useQuery<AssessmentData[]>({
    queryKey: ["assessments-list"],
    queryFn: () => assessmentService.list(),
  });
}
