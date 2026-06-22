import { useQuery } from "@tanstack/react-query";
import { mapRegistryService } from "@/services/map-registry";
import { MapCategory } from "@/types/map-registry";
import { PaginatedResponse } from "@/types/assessment-registry";

export function useMapCategories() {
  return useQuery<PaginatedResponse<MapCategory>>({
    queryKey: ["map-categories"],
    queryFn: () => mapRegistryService.getCategories(),
  });
}
