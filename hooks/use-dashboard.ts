import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => dashboardService.getSummary(),
  });
}

export function useEvacuationCentreLocationSummary() {
  return useQuery({
    queryKey: ["evacuation-centre-location-summary"],
    queryFn: () => dashboardService.getLocationSummary(),
  });
}

export function useProvinceSectorSummary() {
  return useQuery({
    queryKey: ["province-sector-summary"],
    queryFn: () => dashboardService.getProvinceSectorSummary(),
  });
}

export function useHistoricalEvents() {
  return useQuery({
    queryKey: ["historical-events"],
    queryFn: () => dashboardService.getHistoricalEvents(),
  });
}

export function useEvacuationCentres(search?: string) {
  return useQuery({
    queryKey: ["evacuation-centres", search],
    queryFn: () => dashboardService.getEvacuationCentres(search),
  });
}

export function useResponseTrackingSummary() {
  return useQuery({
    queryKey: ["response-tracking-summary"],
    queryFn: () => dashboardService.getResponseTrackingSummary(),
  });
}

export function useEvacuationCentresStats(province?: string) {
  return useQuery({
    queryKey: ["evacuation-centres-stats", province],
    queryFn: () => dashboardService.getEvacuationCentresStats(province),
  });
}

export function useEvacuationCentreLocations(province?: string) {
  return useQuery({
    queryKey: ["evacuation-centre-locations", province],
    queryFn: () => dashboardService.getEvacuationCentreLocations(province),
  });
}

export function useDisplacementStats() {
  return useQuery({
    queryKey: ["displacement-stats"],
    queryFn: () => dashboardService.getDisplacementStats(),
  });
}
