import { siteConfig } from "@/config/site";
import { ApiError } from "@/services/auth";
import {
  ClusterContactItem,
  PaginatedClusterContactResponse,
  CreateClusterContactPayload,
  SendClusterContactEmailPayload,
  SendClusterContactEmailResponse,
} from "@/types/cluster-contact";

function getAuthHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    if (token.startsWith("eyJ") || token.includes(".")) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["Authorization"] = `Token ${token}`;
    }
  }
  return headers;
}

export const clusterContactService = {
  // GET /api/cluster-contact/
  list: async (
    page: number = 1,
    token: string | null = null,
    search?: string,
    pageSize?: number
  ): Promise<PaginatedClusterContactResponse> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams({ page: page.toString() });
    if (pageSize) {
      params.append("page_size", pageSize.toString());
    }
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const url = `${baseUrl}/api/cluster-contact/?${params.toString()}`;
    const headers = getAuthHeaders(token);

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch cluster contacts (${res.status})`);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    }
    return data;
  },

  // POST /api/cluster-contact/
  create: async (
    payload: CreateClusterContactPayload,
    token: string | null = null
  ): Promise<ClusterContactItem> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/cluster-contact/`;
    const headers = {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    };

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    let responseData: any = null;
    if (contentType && contentType.includes("application/json")) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      let errorMessage = "Failed to create cluster contact.";
      if (responseData && typeof responseData === "object") {
        if (responseData.detail) errorMessage = responseData.detail;
        else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey) {
            const val = responseData[firstKey];
            errorMessage = `${firstKey}: ${Array.isArray(val) ? val.join(", ") : val}`;
          }
        }
      } else if (typeof responseData === "string" && responseData.length < 150) {
        errorMessage = responseData;
      }
      throw new Error(errorMessage);
    }

    return responseData;
  },

  // POST /api/cluster-contact/send-email/
  sendEmail: async (
    payload: SendClusterContactEmailPayload,
    token: string | null = null
  ): Promise<SendClusterContactEmailResponse> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/cluster-contact/send-email/`;

    const headers: Record<string, string> = {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        subject: payload.subject,
        body: payload.body,
        emails: payload.emails || [],
      }),
    });

    let responseData: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage = "Failed to send email to cluster contacts.";
      if (responseData && typeof responseData === "object") {
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey) {
            const val = responseData[firstKey];
            errorMessage = `${firstKey}: ${Array.isArray(val) ? val.join(", ") : val}`;
          }
        }
      } else if (typeof responseData === "string" && responseData.length < 150) {
        errorMessage = responseData;
      }
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData;
  },
};
