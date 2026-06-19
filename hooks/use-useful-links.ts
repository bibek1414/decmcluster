import { useQuery } from "@tanstack/react-query";
import { usefulLinkService } from "@/services/useful-link";
import { UsefulLinkData } from "@/types/useful-link";

export function useUsefulLinks(search?: string) {
  return useQuery<UsefulLinkData[]>({
    queryKey: ["useful-links-list", search],
    queryFn: () => usefulLinkService.list(search),
  });
}
