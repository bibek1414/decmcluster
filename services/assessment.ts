import { siteConfig } from "@/config/site";

export interface AssessmentData {
  id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  pdf?: string | null;
  excel?: string | null;
  created_at: string;
  updated_at: string;
}

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
