import PartnersClient from "@/components/partners/partners-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humanitarian Partners & Cluster Directory",
  description:
    "Official directory of humanitarian partner organizations, inter-cluster coordinators, NDMO focal points, and IOM representatives in Vanuatu.",
  keywords: [
    "DECM Partners Vanuatu",
    "Humanitarian Cluster Directory Vanuatu",
    "IOM Vanuatu Partners",
    "NDMO Cluster Coordinators",
  ],
  openGraph: {
    title: "Humanitarian Partners & Cluster Directory | DECM Cluster Vanuatu",
    description:
      "Official directory of humanitarian partner organizations, inter-cluster coordinators, NDMO focal points, and IOM representatives in Vanuatu.",
  },
};

export default function PartnersPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <PartnersClient />
    </div>
  );
}
