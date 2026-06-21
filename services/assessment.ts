import { siteConfig } from "@/config/site";
import { AssessmentData } from "@/types/assessment";

export const assessmentService = {
  list: async (): Promise<AssessmentData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/assessment/`);
    if (!res.ok) {
      throw new Error("Failed to fetch assessment tools");
    }
    return res.json();
  },
};
