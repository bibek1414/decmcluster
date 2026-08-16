import { siteConfig } from "@/config/site";
import { ApiError } from "@/services/auth";
import { SendEmailPayload, SendEmailResponse } from "@/types/newsletter";

export const newsletterService = {
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
