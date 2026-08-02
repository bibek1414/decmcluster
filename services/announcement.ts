import { siteConfig } from "@/config/site";
import { Announcement, PaginatedAnnouncementsResponse } from "@/types/announcement";

export const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/announcements/`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.warn(`Announcements fetch failed with status ${res.status}.`);
        return [];
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray((data as PaginatedAnnouncementsResponse).results)) {
        return (data as PaginatedAnnouncementsResponse).results;
      }
      return [];
    } catch (error) {
      console.warn("Error fetching announcements:", error);
      return [];
    }
  },
};
