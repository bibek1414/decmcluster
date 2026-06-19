import { useMutation } from "@tanstack/react-query";
import { contactService, ContactPayload } from "@/services/contact";

export function useContactMutation() {
  return useMutation<any, Error, ContactPayload>({
    mutationFn: (payload) => contactService.submit(payload),
  });
}
