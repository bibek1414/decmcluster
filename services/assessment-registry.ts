import { siteConfig } from "@/config/site";
import { AssessmentRegistryData, PaginatedResponse } from "@/types/assessment-registry";

export const assessmentRegistryService = {
  list: async (page: number = 1): Promise<PaginatedResponse<AssessmentRegistryData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/assessment-registry/?page=${page}`);
    if (!res.ok) {
      throw new Error("Failed to fetch assessment registry data");
    }
    return res.json();
  },
};
