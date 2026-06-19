import { siteConfig } from "@/config/site";

export interface ReportData {
  id: number;
  name: string;
  file: string;
  created_at: string;
  updated_at: string;
}

export const reportService = {
  list: async (): Promise<ReportData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/report/`);
    if (!res.ok) {
      throw new Error("Failed to fetch reports");
    }
    return res.json();
  },
};
