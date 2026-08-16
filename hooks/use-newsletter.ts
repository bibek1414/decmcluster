import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsletterService } from "@/services/newsletter";
import {
  PaginatedNewsletterResponse,
  UpdateNewsletterPayload,
} from "@/types/newsletter";

/**
 * Hook to subscribe a new email to the newsletter.
 */
export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => newsletterService.subscribe(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-subscribers"] });
    },
  });
}

/**
 * Hook to fetch paginated newsletter subscribers (Admin view).
 */
export function useAdminNewsletterSubscribers(
  page: number,
  token: string | null,
  search?: string
) {
  return useQuery<PaginatedNewsletterResponse>({
    queryKey: ["admin-newsletter-subscribers", page, token, search],
    queryFn: () => newsletterService.list(page, token, search),
    placeholderData: (previousData) => previousData,
    enabled: token !== null,
  });
}

/**
 * Hook to update a subscriber's subscription status or email.
 */
export function useUpdateNewsletterSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      token,
    }: {
      id: number;
      payload: UpdateNewsletterPayload;
      token: string | null;
    }) => newsletterService.update(id, payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-subscribers"] });
    },
  });
}

/**
 * Hook to delete a newsletter subscriber (superadmin/admin).
 */
export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: number; token: string | null }) =>
      newsletterService.delete(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-subscribers"] });
    },
  });
}

/**
 * Hook to unsubscribe an email address from the newsletter.
 */
export function useUnsubscribeNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => newsletterService.unsubscribe(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-newsletter-subscribers"] });
    },
  });
}
