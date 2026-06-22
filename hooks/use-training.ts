import { useQuery } from "@tanstack/react-query";
import { trainingService } from "@/services/training";
import { TrainingData } from "@/types/training";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useTraining(page: number, search?: string) {
  return useQuery<PaginatedResponse<TrainingData>>({
    queryKey: ["training-list", page, search],
    queryFn: () => trainingService.list(page, search),
    placeholderData: (previousData) => previousData,
  });
}
