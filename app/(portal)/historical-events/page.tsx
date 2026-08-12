import type { Metadata } from "next";
import { HistoricalEventsView } from "@/components/historical-events/historical-events-view";

export const metadata: Metadata = {
  title: "Historical Disaster Events Snapshot",
  description:
    "Archive of historical cyclone events, earthquake displacements, volcanic eruptions, and disaster emergency response history in Vanuatu.",
  keywords: [
    "Vanuatu Disaster History",
    "Tropical Cyclone Pam Displacement",
    "Cyclone Judy Judy Lola Archive",
    "DECM Historical Records Vanuatu",
  ],
  openGraph: {
    title: "Historical Disaster Events Snapshot | DECM Cluster Vanuatu",
    description:
      "Archive of historical cyclone events, earthquake displacements, volcanic eruptions, and disaster emergency response history in Vanuatu.",
  },
};

export default function HistoricalEventsPage() {
  return <HistoricalEventsView />;
}
