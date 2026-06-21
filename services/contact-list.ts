import { siteConfig } from "@/config/site";
import { ContactListData } from "@/types/contact-list";

export const contactListService = {
  list: async (search?: string): Promise<ContactListData[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = search
      ? `${baseUrl}/api/contact-list/?search=${encodeURIComponent(search)}`
      : `${baseUrl}/api/contact-list/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch contact list");
    }
    return res.json();
  },
};
