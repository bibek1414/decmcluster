import { siteConfig } from "@/config/site";
import { LoginRequest, LoginResponse } from "@/types/login";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/api/account/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
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
      let errorMessage = "An error occurred while communicating with the server.";
      if (responseData && typeof responseData === "object") {
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.non_field_errors) {
          errorMessage = Array.isArray(responseData.non_field_errors)
            ? responseData.non_field_errors.join(", ")
            : responseData.non_field_errors;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey && Array.isArray(responseData[firstKey])) {
            errorMessage = `${firstKey}: ${responseData[firstKey].join(", ")}`;
          } else if (firstKey) {
            errorMessage = `${firstKey}: ${responseData[firstKey]}`;
          }
        }
      } else if (typeof responseData === "string" && responseData.length < 150) {
        errorMessage = responseData;
      }
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as LoginResponse;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const response = await fetch(`${baseUrl}/api/account/verify-email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    let responseData: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let errorMessage = "An error occurred while verifying your email.";
      if (responseData && typeof responseData === "object") {
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey) {
            errorMessage = `${firstKey}: ${Array.isArray(responseData[firstKey]) ? responseData[firstKey].join(", ") : responseData[firstKey]}`;
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
