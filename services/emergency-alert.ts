import { siteConfig } from "@/config/site";
import { EmergencyAlert, PaginatedEmergencyAlertsResponse } from "@/types/emergency-alert";

export const emergencyAlertService = {
  getEmergencyAlerts: async (): Promise<EmergencyAlert[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/emergency-alerts/`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.warn(`Emergency alerts fetch failed with status ${res.status}.`);
        return [];
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray((data as PaginatedEmergencyAlertsResponse).results)) {
        return (data as PaginatedEmergencyAlertsResponse).results;
      }
      return [];
    } catch (error) {
      console.warn("Error fetching emergency alerts:", error);
      return [];
    }
  },
};
