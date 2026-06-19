import DashboardSection from "@/components/dashboard/dashboard-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — DECM Cluster Vanuatu",
  description:
    "Displacement tracking, evacuation centres, and sector summaries for Vanuatu.",
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <DashboardSection />
    </div>
  );
}
