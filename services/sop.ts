import { siteConfig } from "@/config/site";
import { SOPData } from "@/types/sop";
import { PaginatedResponse } from "@/types/assessment-registry";

export const sopService = {
  list: async (page: number = 1, search?: string): Promise<PaginatedResponse<SOPData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/sop/?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch SOP documents");
    }
    return res.json();
  },
};
