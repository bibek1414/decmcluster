import DatasetsClient from "@/components/datasets/datasets-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datasets & Operational Repositories",
  description:
    "Explore, download, and reference all uploaded datasets across Standard Operating Procedures (SOPs), 5W response tracking tools, situational reports, and field assessment forms for Vanuatu.",
  keywords: [
    "Vanuatu Disaster Datasets",
    "DECM Cluster Data Hub",
    "SOP Documents Vanuatu",
    "5W Response Tracking Datasets",
    "Disaster Situation Reports",
    "Evacuation Centre Datasets",
    "Displacement Tracking Matrix",
  ],
  openGraph: {
    title: "Datasets & Operational Repositories | DECM Cluster Vanuatu",
    description:
      "Explore, download, and reference all uploaded datasets across Standard Operating Procedures (SOPs), 5W response tracking tools, situational reports, and field assessment forms for Vanuatu.",
  },
};

export default function DatasetsPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <DatasetsClient />
    </div>
  );
}
