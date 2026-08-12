import type { Metadata } from "next";
import { EmergencyAlertsView } from "@/components/emergency-alerts/emergency-alerts-view";

export const metadata: Metadata = {
  title: "Emergency Alerts & Early Warnings",
  description:
    "Real-time emergency alerts, cyclone warnings, volcanic hazard notices, and evacuation advisories issued by NDMO and official authorities across Vanuatu.",
  keywords: [
    "Vanuatu Emergency Alerts",
    "NDMO Warning Bulletins",
    "Tropical Cyclone Alerts Vanuatu",
    "Volcanic Hazard Warnings",
  ],
  openGraph: {
    title: "Emergency Alerts & Early Warnings | DECM Cluster Vanuatu",
    description:
      "Real-time emergency alerts, cyclone warnings, volcanic hazard notices, and evacuation advisories issued by NDMO and official authorities across Vanuatu.",
  },
};

export default function EmergencyAlertsPage() {
  return <EmergencyAlertsView />;
}
