import type { Metadata } from "next";
import { HistoricalEventDetailView } from "@/components/historical-events/historical-event-detail-view";

export const metadata: Metadata = {
  title: "Historical Event Record | DECM Information Management & Data Portal",
  description:
    "Disaster displacement event log, evacuation records and impact history from Vanuatu DECM Cluster.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HistoricalEventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const numericId = parseInt(resolvedParams.id, 10);
  const eventId = isNaN(numericId) ? 1 : numericId;

  return <HistoricalEventDetailView eventId={eventId} />;
}
