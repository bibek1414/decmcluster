import { useQuery } from "@tanstack/react-query";
import { sopService } from "@/services/sop";
import { SOPData } from "@/types/sop";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useSops(page: number, search?: string) {
  return useQuery<PaginatedResponse<SOPData>>({
    queryKey: ["sops-list", page, search],
    queryFn: () => sopService.list(page, search),
    placeholderData: (previousData) => previousData,
  });
}
