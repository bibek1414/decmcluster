import type { Metadata } from "next";
import { LatestUpdatesView } from "@/components/latest-updates/latest-updates-view";

export const metadata: Metadata = {
  title: "Latest News & Disaster Operational Updates",
  description:
    "Recent situation reports, evacuation shelter audits, field assessment updates, and emergency response releases from Vanuatu DECM Cluster.",
  keywords: [
    "Vanuatu Disaster News",
    "Latest Situation Reports Vanuatu",
    "DECM Cluster Operational Updates",
    "NDMO Response Updates",
  ],
  openGraph: {
    title: "Latest News & Disaster Operational Updates | DECM Cluster Vanuatu",
    description:
      "Recent situation reports, evacuation shelter audits, field assessment updates, and emergency response releases from Vanuatu DECM Cluster.",
  },
};

export default function LatestUpdatesPage() {
  return <LatestUpdatesView />;
}
