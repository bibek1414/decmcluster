import { siteConfig } from "@/config/site";
import { UsefulLinkData } from "@/types/useful-link";

export const usefulLinkService = {
  list: async (search?: string): Promise<UsefulLinkData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = search
      ? `${baseUrl}/api/useful-link/?search=${encodeURIComponent(search)}`
      : `${baseUrl}/api/useful-link/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch useful links");
    }
    return res.json();
  },
};
