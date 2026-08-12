import ReportsClient from "@/components/reports/reports-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports & Publications",
  description:
    "Official situation reports, displacement trackers, evacuation audit publications, and emergency response updates for Vanuatu NDMO & DECM Cluster.",
  keywords: [
    "Vanuatu Disaster Reports",
    "NDMO Situation Reports",
    "Displacement Tracking Matrix Reports",
    "DECM Publications Vanuatu",
  ],
  openGraph: {
    title: "Reports & Publications | DECM Cluster Vanuatu",
    description:
      "Official situation reports, displacement trackers, evacuation audit publications, and emergency response updates for Vanuatu NDMO & DECM Cluster.",
  },
};

export default function ReportsPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <ReportsClient />
    </div>
  );
}
