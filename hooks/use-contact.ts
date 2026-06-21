import { useMutation } from "@tanstack/react-query";
import { contactService } from "@/services/contact";
import { ContactPayload } from "@/types/contact";

export function useContactMutation() {
  return useMutation<any, Error, ContactPayload>({
    mutationFn: (payload) => contactService.submit(payload),
  });
}
