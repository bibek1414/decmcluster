import type { Metadata } from "next";
import { PowerBIDashboardsView } from "@/components/powerbi-dashboards/powerbi-dashboards-view";

export const metadata: Metadata = {
  title: "PowerBI Interactive Analytics & Visual Dashboards",
  description:
    "Interactive PowerBI analytics, real-time spatial data visualizer, evacuation capacity analytics, and operational metrics for Vanuatu NDMO.",
  keywords: [
    "Vanuatu PowerBI Disaster Dashboards",
    "DECM Interactive Analytics",
    "Evacuation Centre PowerBI Vanuatu",
    "NDMO Analytics Portal",
  ],
  openGraph: {
    title: "PowerBI Interactive Analytics & Visual Dashboards | DECM Cluster Vanuatu",
    description:
      "Interactive PowerBI analytics, real-time spatial data visualizer, evacuation capacity analytics, and operational metrics for Vanuatu NDMO.",
  },
};

export default function PowerBIDashboardsPage() {
  return <PowerBIDashboardsView />;
}
