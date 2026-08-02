import type { Metadata } from "next";
import { PowerBIDashboardsView } from "@/components/powerbi-dashboards/powerbi-dashboards-view";

export const metadata: Metadata = {
  title: "PowerBI Dashboards | DECM Information Management & Data Portal",
  description:
    "Interactive real-time visualization reports, spatial analytics and operational statistics for Vanuatu DECM Cluster.",
};

export default function PowerBIDashboardsPage() {
  return <PowerBIDashboardsView />;
}
