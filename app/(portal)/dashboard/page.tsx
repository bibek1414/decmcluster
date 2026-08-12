import DashboardSection from "@/components/dashboard/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "National Operations Dashboard",
  description:
    "Real-time national disaster operations dashboard, evacuation centre metrics, displacement statistics, and sector summaries for NDMO & DECM Cluster Vanuatu.",
  keywords: [
    "Vanuatu Disaster Dashboard",
    "Evacuation Centre Capacity Vanuatu",
    "Displacement Statistics Vanuatu",
    "DECM Cluster Metrics",
  ],
  openGraph: {
    title: "National Operations Dashboard | DECM Cluster Vanuatu",
    description:
      "Real-time national disaster operations dashboard, evacuation centre metrics, displacement statistics, and sector summaries for NDMO & DECM Cluster Vanuatu.",
  },
};

export default function DashboardPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8 animate-fadeIn">
      <DashboardSection />
    </div>
  );
}
