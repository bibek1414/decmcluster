import { useQuery } from "@tanstack/react-query";
import { contactListService } from "@/services/contact-list";
import { ContactListData } from "@/types/contact-list";

export function useContactList(search?: string) {
  return useQuery<ContactListData[]>({
    queryKey: ["contact-list", search],
    queryFn: () => contactListService.list(search),
  });
}
