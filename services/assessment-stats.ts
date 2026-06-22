import { siteConfig } from "@/config/site";
import { AssessmentStat } from "@/types/assessment-stats";
import { PaginatedResponse } from "@/types/assessment-registry";

export const assessmentStatsService = {
  list: async (): Promise<PaginatedResponse<AssessmentStat>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/assessment-stats/`);
    if (!res.ok) {
      throw new Error("Failed to fetch assessment stats");
    }
    return res.json();
  },
};
