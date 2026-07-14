import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, token }: { payload: any; token: string | null }) =>
      userService.create(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload, token }: { id: number; payload: any; token: string | null }) =>
      userService.update(id, payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      userService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
    },
  });
}
