import { siteConfig } from "@/config/site";
import { BannerData } from "@/types/banner";

export const bannerService = {
  list: async (): Promise<BannerData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/dashboard/banners/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch banners");
    }
    return res.json();
  },
};
