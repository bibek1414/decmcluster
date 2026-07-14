import { siteConfig } from "@/config/site";
import { MapCategory, MapData } from "@/types/map-registry";
import { PaginatedResponse } from "@/types/assessment-registry";

export const mapRegistryService = {
  getCategories: async (): Promise<PaginatedResponse<MapCategory>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/map-category/`);
    if (!res.ok) {
      throw new Error("Failed to fetch map categories");
    }
    return res.json();
  },
  getMaps: async (
    page: number = 1,
    categorySlug?: string,
    search?: string,
  ): Promise<PaginatedResponse<MapData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/map/?page=${page}&page_size=10`;
    if (categorySlug) {
      url += `&category=${encodeURIComponent(categorySlug)}`;
    }
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch maps");
    }
    return res.json();
  },
};
