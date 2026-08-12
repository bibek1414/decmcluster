import type { Metadata } from "next";
import { AnnouncementsView } from "@/components/announcements/announcements-view";

export const metadata: Metadata = {
  title: "Official Announcements & Notices",
  description:
    "Important cluster announcements, policy updates, humanitarian coordination notices, and official disaster management bulletins for Vanuatu.",
  keywords: [
    "DECM Announcements Vanuatu",
    "NDMO Cluster Notices",
    "Disaster Management Advisories Vanuatu",
    "Humanitarian Bulletins Vanuatu",
  ],
  openGraph: {
    title: "Official Announcements & Notices | DECM Cluster Vanuatu",
    description:
      "Important cluster announcements, policy updates, humanitarian coordination notices, and official disaster management bulletins for Vanuatu.",
  },
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}
