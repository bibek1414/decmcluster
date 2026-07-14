import { siteConfig } from "@/config/site";
import { ResponseTrackingData } from "@/types/response-tracking";

export const responseTrackingService = {
  list: async (search?: string): Promise<ResponseTrackingData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = search
      ? `${baseUrl}/api/response-tracking/?search=${encodeURIComponent(search)}`
      : `${baseUrl}/api/response-tracking/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch response tracking data");
    }
    return res.json();
  },

  create: async (name: string, file: File, token: string | null): Promise<ResponseTrackingData> => {
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

    const res = await fetch(`${baseUrl}/api/response-tracking/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to upload response tracking tool";
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

    const res = await fetch(`${baseUrl}/api/response-tracking/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to delete response tracking tool");
    }
  },
};
