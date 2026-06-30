import { siteConfig } from "@/config/site";
import { UserData } from "@/types/admin/user";
import { PaginatedResponse } from "@/types/assessment-registry";

export const userService = {
  list: async (
    page: number = 1,
    token: string | null,
    search?: string
  ): Promise<PaginatedResponse<UserData>> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    let url = `${baseUrl}/api/account/users/?page=${page}&page_size=10`;
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
      throw new Error("Failed to fetch users");
    }
    return res.json();
  },

  create: async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: Record<string, any>,
    token: string | null
  ): Promise<UserData> => {
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

    const res = await fetch(`${baseUrl}/api/account/users/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to create user";
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

    const res = await fetch(`${baseUrl}/api/account/users/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }
  },

  update: async (
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: Record<string, any>,
    token: string | null
  ): Promise<UserData> => {
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

    const res = await fetch(`${baseUrl}/api/account/users/${id}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = "Failed to update user";
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
