import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { UserData } from "@/types/admin/user";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useAdminUsers(page: number, token: string | null, search?: string) {
  return useQuery<PaginatedResponse<UserData>>({
    queryKey: ["admin-users-list", page, token, search],
    queryFn: () => userService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}
