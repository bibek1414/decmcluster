import { useQuery } from "@tanstack/react-query";
import { responseTrackingService } from "@/services/response-tracking";
import { ResponseTrackingData } from "@/types/response-tracking";

export function useResponseTracking(search?: string) {
  return useQuery<ResponseTrackingData[]>({
    queryKey: ["response-tracking-list", search],
    queryFn: () => responseTrackingService.list(search),
  });
}
