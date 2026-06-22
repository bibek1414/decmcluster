import { useQuery } from "@tanstack/react-query";
import { sopService } from "@/services/sop";
import { SOPData } from "@/types/admin/sop";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminSops(
  page: number,
  token: string | null,
  search?: string
) {
  return useQuery<PaginatedResponse<SOPData>>({
    queryKey: ["admin-sops-list", page, token, search],
    queryFn: () => sopService.listAdmin(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}
