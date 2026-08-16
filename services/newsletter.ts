import { siteConfig } from "@/config/site";
import { ApiError } from "@/services/auth";
import {
  NewsletterSubscription,
  PaginatedNewsletterResponse,
  UpdateNewsletterPayload,
  SendEmailPayload,
  SendEmailResponse,
} from "@/types/newsletter";

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

export const newsletterService = {
  // Public endpoint for subscribing via footer / web app
  subscribe: async (email: string): Promise<NewsletterSubscription> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/newsletter/`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const contentType = res.headers.get("content-type");
    let responseData: any = null;
    if (contentType && contentType.includes("application/json")) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    if (!res.ok) {
      let errorMessage = "Failed to subscribe to newsletter.";
      if (responseData && typeof responseData === "object") {
        if (responseData.detail) errorMessage = responseData.detail;
        else if (responseData.email) {
          errorMessage = Array.isArray(responseData.email)
            ? responseData.email.join(", ")
            : responseData.email;
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
      throw new Error(errorMessage);
    }

    return responseData;
  },

  // Admin endpoint: List subscribers with pagination and search
  list: async (
    page: number = 1,
    token: string | null = null,
    search?: string,
    pageSize?: number
  ): Promise<PaginatedNewsletterResponse> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const params = new URLSearchParams({ page: page.toString() });
    if (pageSize) {
      params.append("page_size", pageSize.toString());
    }
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const url = `${baseUrl}/api/newsletter/?${params.toString()}`;
    const headers = getAuthHeaders(token);

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch newsletter subscribers (${res.status})`);
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

  // Admin endpoint: Get subscriber detail
  getById: async (id: number, token: string | null = null): Promise<NewsletterSubscription> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/newsletter/${id}/`;
    const headers = getAuthHeaders(token);

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch subscriber detail (${res.status})`);
    }

    return res.json();
  },

  // Admin endpoint: Update subscriber status / details
  update: async (
    id: number,
    payload: UpdateNewsletterPayload,
    token: string | null = null
  ): Promise<NewsletterSubscription> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/newsletter/${id}/`;
    const headers = {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    };

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = "Failed to update newsletter subscription.";
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) errorMessage = parsed.detail;
        else if (typeof parsed === "object") {
          const firstKey = Object.keys(parsed)[0];
          errorMessage = `${firstKey}: ${parsed[firstKey]}`;
        }
      } catch {}
      throw new Error(errorMessage);
    }

    return res.json();
  },

  // Admin endpoint: Delete subscriber (superadmin/admin feature)
  delete: async (id: number, token: string | null = null): Promise<void> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/newsletter/${id}/`;
    const headers = getAuthHeaders(token);

    const res = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      let errorMessage = `Failed to delete subscriber (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData.detail) errorMessage = errorData.detail;
      } catch {}
      throw new Error(errorMessage);
    }
  },

  // Existing sendEmail feature
  sendEmail: async (
    payload: SendEmailPayload,
    token: string | null
  ): Promise<SendEmailResponse> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/newsletter/send-email/`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      if (token.startsWith("eyJ") || token.includes(".")) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    try {
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
        let errorMessage = "Failed to send email newsletter.";
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
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err.message || "Network error occurred while attempting to send newsletter.",
        0,
        err
      );
    }
  },
};

