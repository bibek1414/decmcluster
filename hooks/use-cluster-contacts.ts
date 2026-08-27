import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clusterContactService } from "@/services/cluster-contact";
import {
  PaginatedClusterContactResponse,
  CreateClusterContactPayload,
  SendClusterContactEmailPayload,
} from "@/types/cluster-contact";

/**
 * Hook to fetch paginated cluster contacts from API.
 */
export function useClusterContacts(
  page: number = 1,
  token: string | null = null,
  search?: string,
  pageSize?: number
) {
  return useQuery<PaginatedClusterContactResponse>({
    queryKey: ["cluster-contacts", page, token, search, pageSize],
    queryFn: () => clusterContactService.list(page, token, search, pageSize),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to create a new cluster contact.
 */
export function useCreateClusterContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: CreateClusterContactPayload;
      token: string | null;
    }) => clusterContactService.create(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cluster-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["cluster-contacts-for-input"] });
    },
  });
}

/**
 * Hook to send email broadcast to cluster contacts.
 */
export function useSendClusterContactEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      token,
    }: {
      payload: SendClusterContactEmailPayload;
      token: string | null;
    }) => clusterContactService.sendEmail(payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cluster-contacts"] });
    },
  });
}
