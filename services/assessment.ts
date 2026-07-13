import { siteConfig } from "@/config/site";
import { AssessmentData, AssessmentResultData } from "@/types/assessment";

export const assessmentService = {
  list: async (): Promise<AssessmentData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/assessment/`);
    if (!res.ok) {
      throw new Error("Failed to fetch assessments");
    }
    return res.json();
  },

  get: async (slug: string): Promise<AssessmentData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/assessment/${slug}/`);
    if (!res.ok) {
      throw new Error("Failed to fetch assessment details");
    }
    return res.json();
  },

  create: async (
    name: string,
    description: string,
    pdf: File | null,
    excel: File | null,
    isPublic: boolean,
    token: string | null
  ): Promise<AssessmentData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("name", name);
    if (description) {
      formData.append("description", description);
    }
    if (pdf) {
      formData.append("pdf", pdf);
    }
    if (excel) {
      formData.append("excel", excel);
    }
    formData.append("is_public", String(isPublic));

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/assessment/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create assessment";
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
    slug: string,
    name: string,
    description: string,
    pdf: File | null,
    excel: File | null,
    isPublic: boolean,
    token: string | null
  ): Promise<AssessmentData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (description !== undefined && description !== null) {
      formData.append("description", description);
    }
    if (pdf) {
      formData.append("pdf", pdf);
    }
    if (excel) {
      formData.append("excel", excel);
    }
    formData.append("is_public", String(isPublic));

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/assessment/${slug}/`, {
      method: "PATCH",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update assessment";
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

  delete: async (slug: string, token: string | null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/assessment/${slug}/`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to delete assessment");
    }
  },

  listResults: async (
    slug: string,
    token?: string | null
  ): Promise<AssessmentResultData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/assessment/${slug}/result/`, {
      headers,
    });
    if (!res.ok) {
      throw new Error("Failed to fetch assessment results");
    }
    return res.json();
  },

  createResult: async (
    slug: string,
    title: string,
    description: string,
    file: File | null,
    token: string | null
  ): Promise<AssessmentResultData> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const formData = new FormData();
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    if (file) {
      formData.append("file", file);
    }

    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}/api/assessment/${slug}/result/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to upload assessment result";
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

  deleteResult: async (
    slug: string,
    resultId: number,
    token: string | null
  ): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    const res = await fetch(
      `${baseUrl}/api/assessment/${slug}/result/${resultId}/`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete assessment result");
    }
  },
};
