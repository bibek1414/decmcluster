import { siteConfig } from "@/config/site";
import {
  DashboardSummary,
  EvacuationCentreLocationSummary,
  ProvinceSectorSummary,
  HistoricalEvent,
  EvacuationCentre,
  ResponseTrackingSummary,
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
};
