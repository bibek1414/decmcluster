import { siteConfig } from "@/config/site";

export interface ContactPayload {
  full_name: string;
  email?: string;
  phone: string;
  message: string;
}

export const contactService = {
  submit: async (payload: ContactPayload): Promise<any> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg =
        errorData.detail ||
        (errorData.non_field_errors && errorData.non_field_errors.join(", ")) ||
        Object.entries(errorData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
          .join(" | ") ||
        "Failed to submit message";
      throw new Error(errorMsg);
    }

    return res.json();
  },
};
