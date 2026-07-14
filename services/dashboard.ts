import { siteConfig } from "@/config/site";
import {
  DashboardSummary,
  EvacuationCentreLocationSummary,
  ProvinceSectorSummary,
  HistoricalEvent,
  EvacuationCentre,
  ResponseTrackingSummary,
  EvacuationCentresStats,
  EvacuationCentreLocation,
  DisplacementStats,
} from "@/types/dashboard";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/dashboard/dashboard-summary/`);
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard summary");
    }
    return res.json();
  },

  getLocationSummary: async (): Promise<EvacuationCentreLocationSummary[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/dashboard/evacuation-centre-location-summary/`);
    if (!res.ok) {
      throw new Error("Failed to fetch evacuation centre location summary");
    }
    return res.json();
  },

  getProvinceSectorSummary: async (): Promise<ProvinceSectorSummary[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/dashboard/province-sector-summary/`);
    if (!res.ok) {
      throw new Error("Failed to fetch province sector summary");
    }
    return res.json();
  },

  getHistoricalEvents: async (): Promise<HistoricalEvent[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/dashboard/historical-events/`);
    if (!res.ok) {
      throw new Error("Failed to fetch historical events");
    }
    return res.json();
  },

  getEvacuationCentres: async (search?: string): Promise<EvacuationCentre[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/dashboard/evacuation-centre-list/`;
    if (search && search.trim() !== "") {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch evacuation centres");
    }
    return res.json();
  },

  getResponseTrackingSummary: async (): Promise<ResponseTrackingSummary[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/dashboard/response-tracking-summary/`);
    if (!res.ok) {
      throw new Error("Failed to fetch response tracking summary");
    }
    return res.json();
  },

  getEvacuationCentresStats: async (filters?: { province?: string; latitude?: number; longitude?: number }): Promise<EvacuationCentresStats> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (filters?.province) params.append("province", filters.province);
    if (filters?.latitude !== undefined) params.append("latitude", filters.latitude.toString());
    if (filters?.longitude !== undefined) params.append("longitude", filters.longitude.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `${baseUrl}/api/evacuation-centres/stats/${query}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch evacuation centres stats");
    }
    return res.json();
  },

  getEvacuationCentreLocations: async (filters?: { province?: string; latitude?: number; longitude?: number }): Promise<EvacuationCentreLocation[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (filters?.province) params.append("province", filters.province);
    if (filters?.latitude !== undefined) params.append("latitude", filters.latitude.toString());
    if (filters?.longitude !== undefined) params.append("longitude", filters.longitude.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `${baseUrl}/api/evacuation-centres/location/${query}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch evacuation centre locations");
    }
    return res.json();
  },

  getDisplacementStats: async (filters?: {
    admin1_name?: string;
    operation?: string;
    reporting_year?: string;
  }): Promise<DisplacementStats> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();
    if (filters?.admin1_name) params.append("admin1_name", filters.admin1_name);
    if (filters?.operation) params.append("operation", filters.operation);
    if (filters?.reporting_year) params.append("reporting_year", filters.reporting_year);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${baseUrl}/api/displacements/stats/${query}`);
    if (!res.ok) {
      throw new Error("Failed to fetch displacement stats");
    }
    return res.json();
  },

  getDisplacementFilters: async (): Promise<{
    admin1_names: string[];
    operations: string[];
    reporting_years: number[];
  }> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    try {
      const res = await fetch(`${baseUrl}/api/displacements/unique-filters/`);
      if (!res.ok) {
        throw new Error("Failed to fetch displacement unique-filters");
      }
      return await res.json();
    } catch (error) {
      console.warn("Fallback unique-filters used:", error);
      return {
        admin1_names: ["Malampa", "Penama", "Sanma", "Shefa", "Tafea"],
        operations: [
          "Cyclone Pam",
          "Manaro Volcano Eruption (Ambae)",
          "Tropical Cyclone Harold Response",
        ],
        reporting_years: [2015, 2017, 2018, 2019, 2020],
      };
    }
  },
};

