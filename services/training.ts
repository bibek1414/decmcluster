import { siteConfig } from "@/config/site";
import { TrainingData } from "@/types/training";
import { PaginatedResponse } from "@/types/assessment-registry";

export const trainingService = {
  list: async (page: number = 1, search?: string): Promise<PaginatedResponse<TrainingData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/training/?page=${page}`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch training courses");
    }
    return res.json();
  },
};
