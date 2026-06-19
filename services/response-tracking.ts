import { siteConfig } from "@/config/site";
import { ResponseTrackingData } from "@/types/response-tracking";

export const responseTrackingService = {
  list: async (search?: string): Promise<ResponseTrackingData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = search
      ? `${baseUrl}/api/response-tracking/?search=${encodeURIComponent(search)}`
      : `${baseUrl}/api/response-tracking/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch response tracking data");
    }
    return res.json();
  },
};
