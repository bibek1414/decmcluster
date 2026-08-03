import type { Metadata } from "next";
import { LatestUpdatesView } from "@/components/latest-updates/latest-updates-view";

export const metadata: Metadata = {
  title: "Latest Updates | DECM Information Management & Data Portal",
  description:
    "Access recent announcements, situation reports, assessments, data releases, meeting outcomes, technical guidance and portal updates from the DECM Cluster.",
};

export default function LatestUpdatesPage() {
  return <LatestUpdatesView />;
}
