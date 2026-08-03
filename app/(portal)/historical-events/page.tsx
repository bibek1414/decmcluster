import type { Metadata } from "next";
import { HistoricalEventsView } from "@/components/historical-events/historical-events-view";

export const metadata: Metadata = {
  title: "Historical Events Snapshot | DECM Information Management & Data Portal",
  description:
    "Major disaster displacement events, evacuation records and impact history tracked in the Vanuatu DECM database.",
};

export default function HistoricalEventsPage() {
  return <HistoricalEventsView />;
}
