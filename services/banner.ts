import { siteConfig } from "@/config/site";
import { BannerData } from "@/types/banner";

// Beautiful default banners matching the user's requested UI as fallback
const DEFAULT_BANNERS: BannerData[] = [
  {
    id: 1,
    name: "Exercises and Training",
    Image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    description: "World-class data, technology, and scenario design for enhanced readiness.",
  },
  {
    id: 2,
    name: "Predictive Analytics",
    Image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800",
    description: "Make sense of accelerated change to inform decisions, shape outcomes, and define the future.",
  },
  {
    id: 3,
    name: "Resource Prioritization",
    Image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800",
    description: "Leading tools and expertise to help you prioritize resources and protect assets.",
  },
];

export const bannerService = {
  list: async (): Promise<BannerData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/banner/`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn("Failed to fetch banners from API, using default banners", res.status);
        return DEFAULT_BANNERS;
      }
      const data = await res.json();
      
      // Ensure the returned data is an array and has items, otherwise use fallback
      if (Array.isArray(data) && data.length > 0) {
        // Map data to ensure both Image and image fields are supported
        return data.map((item: any) => ({
          ...item,
          Image: item.Image || item.image || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
        }));
      }
      
      return DEFAULT_BANNERS;
    } catch (error) {
      console.warn("Error fetching banners, using default banners:", error);
      return DEFAULT_BANNERS;
    }
  },
};
