import MappingClient from "@/components/mapping/mapping-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GIS & Spatial Mapping — DECM Cluster Vanuatu",
  description: "Interactive coordinates and evacuation shelter mapping.",
};

export default function MappingPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <MappingClient />
    </div>
  );
}
