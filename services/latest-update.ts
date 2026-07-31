import { siteConfig } from "@/config/site";
import {
  LatestUpdate,
  LatestUpdateCategory,
  PaginatedLatestUpdatesResponse,
  PaginatedCategoriesResponse,
} from "@/types/latest-update";

export const latestUpdateService = {
  getCategories: async (): Promise<LatestUpdateCategory[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/latest-update-categories/`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.warn(`Categories fetch failed with status ${res.status}.`);
        return [];
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray((data as PaginatedCategoriesResponse).results)) {
        return (data as PaginatedCategoriesResponse).results;
      }
      return [];
    } catch (error) {
      console.warn("Error fetching categories:", error);
      return [];
    }
  },

  getLatestUpdates: async (filters?: {
    category?: string;
    search?: string;
  }): Promise<LatestUpdate[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams();

    if (filters?.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters?.search && filters.search.trim()) {
      params.append("search", filters.search.trim());
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const url = `${baseUrl}/api/latest-updates/${query}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`Latest updates fetch failed with status ${res.status}.`);
        return [];
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray((data as PaginatedLatestUpdatesResponse).results)) {
        return (data as PaginatedLatestUpdatesResponse).results;
      }
      return [];
    } catch (error) {
      console.warn("Error fetching latest updates:", error);
      return [];
    }
  },
};
