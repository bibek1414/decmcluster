import PartnersClient from "@/components/PartnersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cluster Focal Points — DECM Cluster Vanuatu",
  description: "Directory of National, Provincial, and Inter-Cluster coordinators.",
};

export default function PartnersPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <PartnersClient />
    </div>
  );
}
