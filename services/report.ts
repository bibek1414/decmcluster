import { siteConfig } from "@/config/site";
import { ReportData } from "@/types/report";

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
