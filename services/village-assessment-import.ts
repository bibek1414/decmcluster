import { siteConfig } from "@/config/site";
import { VillageAssessmentImportData } from "@/types/admin/village-assessment-import";
import { PaginatedResponse } from "@/types/assessment-registry";

export const villageAssessmentImportService = {
  list: async (
    page: number = 1,
    token: string | null,
    search?: string,
  ): Promise<PaginatedResponse<VillageAssessmentImportData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/village-assessment-imports/?page=${page}&page_size=10`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      throw new Error("Failed to fetch village assessment imports");
    }
    return res.json();
  },

  create: async (name: string, file: File, token: string | null): Promise<VillageAssessmentImportData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to upload village assessment import";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }

    return res.json();
  },

  delete: async (id: number, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to delete village assessment import");
    }
  },

  get: async (id: number | string, token: string | null): Promise<VillageAssessmentImportData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/${id}/`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch village assessment import details");
    }
    return res.json();
  },

  verify: async (
    id: number | string,
    status: "verified" | "returned",
    comment: string,
    token: string | null,
  ): Promise<VillageAssessmentImportData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/${id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status, comment }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update village assessment import status";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  reverify: async (id: number | string, token: string | null): Promise<VillageAssessmentImportData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/${id}/reverify/`, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to revert village assessment import status";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },

  updateFile: async (
    id: number | string,
    file: File,
    token: string | null,
  ): Promise<VillageAssessmentImportData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/village-assessment-imports/${id}/`, {
      method: "PATCH",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to upload new version";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMsg = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMsg = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch (e) {}
      throw new Error(errorMsg);
    }
    return res.json();
  },
};
