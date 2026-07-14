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

export function useEvacuationCentresStats(filters?: {
  province?: string;
  latitude?: number;
  longitude?: number;
}) {
  return useQuery({
    queryKey: ["evacuation-centres-stats", filters],
    queryFn: () => dashboardService.getEvacuationCentresStats(filters),
  });
}

export function useEvacuationCentreLocations(filters?: {
  province?: string;
  latitude?: number;
  longitude?: number;
}) {
  return useQuery({
    queryKey: ["evacuation-centre-locations", filters],
    queryFn: () => dashboardService.getEvacuationCentreLocations(filters),
  });
}

export function useDisplacementStats(filters?: {
  admin1_name?: string;
  operation?: string;
  reporting_year?: string;
}) {
  return useQuery({
    queryKey: ["displacement-stats", filters],
    queryFn: () => dashboardService.getDisplacementStats(filters),
  });
}

export function useDisplacementFilters() {
  return useQuery({
    queryKey: ["displacement-filters"],
    queryFn: () => dashboardService.getDisplacementFilters(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

