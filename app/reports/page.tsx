import ReportsClient from "@/components/reports/reports-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports & Publications — DECM Cluster Vanuatu",
  description: "Situation updates, displacement trackers, and evacuation audit publications.",
};

export default function ReportsPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <ReportsClient />
    </div>
  );
}
