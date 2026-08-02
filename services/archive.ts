import { siteConfig } from "@/config/site";
import { ArchiveData, ArchiveCreatePayload, ArchiveUpdatePayload } from "@/types/admin/archive";
import { PaginatedResponse } from "@/types/assessment-registry";

const getAuthHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (token) {
    if (token.startsWith("eyJ") || token.includes(".")) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["Authorization"] = `Token ${token}`;
    }
  }
  return headers;
};

export const archiveService = {
  listAdmin: async (
    page: number = 1,
    token: string | null,
    search?: string,
  ): Promise<PaginatedResponse<ArchiveData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/archives/?page=${page}&page_size=10`;
    if (search && search.trim() !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch archive records");
    }
    return res.json();
  },

  get: async (id: number | string, token: string | null): Promise<ArchiveData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/archives/${id}/`, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch archive record details");
    }
    return res.json();
  },

  create: async (payload: ArchiveCreatePayload, token: string | null): Promise<ArchiveData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();

    formData.append("survey_type", payload.survey_type);
    formData.append("date", payload.date);
    formData.append("survery_tools", payload.survery_tools);
    formData.append("level", payload.level);
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const res = await fetch(`${baseUrl}/api/archives/`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create archive entry";
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

  update: async (
    id: number | string,
    payload: ArchiveUpdatePayload,
    token: string | null,
  ): Promise<ArchiveData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();

    if (payload.survey_type !== undefined) formData.append("survey_type", payload.survey_type);
    if (payload.date !== undefined) formData.append("date", payload.date);
    if (payload.survery_tools !== undefined) formData.append("survery_tools", payload.survery_tools);
    if (payload.level !== undefined) formData.append("level", payload.level);
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const res = await fetch(`${baseUrl}/api/archives/${id}/`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update archive entry";
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

  delete: async (id: number | string, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/archives/${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      throw new Error("Failed to delete archive entry");
    }
  },
};
