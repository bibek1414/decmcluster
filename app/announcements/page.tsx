import type { Metadata } from "next";
import { AnnouncementsView } from "@/components/announcements/announcements-view";

export const metadata: Metadata = {
  title: "Announcements | DECM Information Management & Data Portal",
  description:
    "Find important announcements, coordination notices, policy updates and official messages from the DECM Cluster.",
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}
