import type { Metadata } from "next";
import { EmergencyAlertsView } from "@/components/emergency-alerts/emergency-alerts-view";

export const metadata: Metadata = {
  title: "Emergency Alerts | DECM Information Management & Data Portal",
  description:
    "View active alerts, early warnings and critical emergency notices issued by official authorities across Vanuatu.",
};

export default function EmergencyAlertsPage() {
  return <EmergencyAlertsView />;
}
