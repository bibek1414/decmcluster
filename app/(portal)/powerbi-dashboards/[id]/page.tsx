import type { Metadata } from "next";
import { PowerBIDashboardsView } from "@/components/powerbi-dashboards/powerbi-dashboards-view";

export const metadata: Metadata = {
  title: "PowerBI Dashboard Report | DECM Information Management & Data Portal",
  description:
    "Interactive real-time visualization report powered by PowerBI for Vanuatu DECM Cluster.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PowerBIDashboardDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const numericId = parseInt(resolvedParams.id, 10);
  const reportId = isNaN(numericId) ? undefined : numericId;

  return <PowerBIDashboardsView reportId={reportId} />;
}
