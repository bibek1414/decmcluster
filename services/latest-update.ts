import { siteConfig } from "@/config/site";
import { LatestUpdate, PaginatedLatestUpdatesResponse } from "@/types/latest-update";

export const FALLBACK_LATEST_UPDATES: LatestUpdate[] = [
  {
    id: 2,
    title: "Information Management training materials published",
    slug: "information-management-training-materials-publishe",
    short_description:
      "Presentation materials, practical exercises and reference notes from the DECM Information Management training are now available for participating institutions and cluster partners.",
    description:
      "Presentation materials, practical exercises and reference notes from the DECM Information Management training are now available for participating institutions and cluster partners.",
    thumbnail_image:
      "https://decmcluster.blob.core.windows.net/media/latest_update/thumbnail/images_MFdtasZ.webp",
    thumbnail_alt_desc: "Information Management training materials published",
    meta_title: "Information Management training materials published",
    meta_description: "Information Management training materials published",
    is_featured: false,
    category: "resource",
    created_at: "2026-07-31T10:40:46.054661Z",
    updated_at: "2026-07-31T10:40:46.054674Z",
  },
  {
    id: 1,
    title: "DECM Information Management and Data Portal is now available",
    slug: "decm-information-management-and-data-portal-is-now",
    short_description:
      "The DECM Cluster has introduced a central information portal to improve access to validated displacement information, evacuation centre data, operational dashboards, assessment tools, guidance documents and partner resources.",
    description:
      "The DECM Cluster has introduced a central information portal to improve access to validated displacement information, evacuation centre data, operational dashboards, assessment tools, guidance documents and partner resources.\r\n\r\nThe portal is intended to support consistent information sharing across preparedness, emergency response and recovery. Content will be updated as new information is validated and approved by the relevant authorities and cluster partners.",
    thumbnail_image:
      "https://decmcluster.blob.core.windows.net/media/latest_update/thumbnail/images.webp",
    thumbnail_alt_desc: null,
    meta_title: null,
    meta_description: null,
    is_featured: true,
    category: "announcement",
    created_at: "2026-07-31T10:39:58.648185Z",
    updated_at: "2026-07-31T10:39:58.648196Z",
  },
];

export const latestUpdateService = {
  getLatestUpdates: async (): Promise<LatestUpdate[]> => {
    const baseUrl = siteConfig.apiUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/latest-updates/`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.warn(`Latest updates fetch failed with status ${res.status}. Using fallback data.`);
        return FALLBACK_LATEST_UPDATES;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      } else if (data && Array.isArray((data as PaginatedLatestUpdatesResponse).results)) {
        return (data as PaginatedLatestUpdatesResponse).results;
      }
      return FALLBACK_LATEST_UPDATES;
    } catch (error) {
      console.warn("Error fetching latest updates, using fallback:", error);
      return FALLBACK_LATEST_UPDATES;
    }
  },
};
