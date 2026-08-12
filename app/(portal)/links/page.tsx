import LinksClient from "@/components/links/links-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Useful Links & External Resources",
  description:
    "Curated portal links to official disaster management databases, VMGD weather alerts, IOM DTM portals, and Pacific humanitarian networks.",
  keywords: [
    "Vanuatu Disaster Links",
    "VMGD Weather Alerts",
    "IOM DTM Portal Links",
    "Pacific Data Hub Links",
  ],
  openGraph: {
    title: "Useful Links & External Resources | DECM Cluster Vanuatu",
    description:
      "Curated portal links to official disaster management databases, VMGD weather alerts, IOM DTM portals, and Pacific humanitarian networks.",
  },
};

export default function LinksPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <LinksClient />
    </div>
  );
}
