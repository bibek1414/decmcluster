import { siteConfig } from "@/config/site";
import { PowerBIData } from "@/types/powerbi";

const getHeaders = (token: string | null, contentType?: string) => {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (token) {
    if (token.startsWith("eyJ") || token.includes(".")) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["Authorization"] = `Token ${token}`;
    }
  }
  return headers;
};

export const powerbiService = {
  get: async (token: string | null): Promise<PowerBIData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/dashboard/powerbi-iframe/`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(token),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch PowerBI configurations");
    }
    return res.json();
  },

  update: async (
    id: number,
    iframeLink: string,
    token: string | null,
  ): Promise<PowerBIData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/dashboard/powerbi-iframe/${id}/`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: getHeaders(token, "application/json"),
      body: JSON.stringify({ iframe_link: iframeLink }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update PowerBI link";
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
