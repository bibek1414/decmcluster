import { siteConfig } from "@/config/site";
import { ReportData } from "@/types/report";
import { PaginatedResponse } from "@/types/assessment-registry";

export const reportService = {
  list: async (page: number = 1, search?: string): Promise<PaginatedResponse<ReportData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/report/?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch reports");
    }
    return res.json();
  },
};
