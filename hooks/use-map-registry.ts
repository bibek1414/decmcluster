import { useQuery } from "@tanstack/react-query";
import { mapRegistryService } from "@/services/map-registry";
import { MapData } from "@/types/map-registry";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useMapRegistry(page: number, categorySlug?: string, search?: string) {
  return useQuery<PaginatedResponse<MapData>>({
    queryKey: ["map-list", page, categorySlug, search],
    queryFn: () => mapRegistryService.getMaps(page, categorySlug, search),
    placeholderData: (previousData) => previousData,
  });
}
