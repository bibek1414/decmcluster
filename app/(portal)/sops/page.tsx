import SopsClient from "@/components/sops/sops-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standard Operating Procedures (SOPs) & Guidelines",
  description:
    "Standard Operating Procedures (SOPs), operational guidelines, evacuation centre management rules, and role matrix for NDMO and DECM Cluster Vanuatu.",
  keywords: [
    "Vanuatu Evacuation Centre SOPs",
    "NDMO Disaster Guidelines",
    "Displacement Cluster Procedures",
    "Evacuation Shelter Rules Vanuatu",
  ],
  openGraph: {
    title: "Standard Operating Procedures (SOPs) & Guidelines | DECM Cluster Vanuatu",
    description:
      "Standard Operating Procedures (SOPs), operational guidelines, evacuation centre management rules, and role matrix for NDMO and DECM Cluster Vanuatu.",
  },
};

export default function SopsPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <SopsClient />
    </div>
  );
}
