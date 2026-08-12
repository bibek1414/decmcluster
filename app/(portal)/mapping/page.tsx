import MappingClient from "@/components/mapping/mapping-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive GIS & Spatial Mapping Portal",
  description:
    "Interactive spatial GIS mapping portal for Vanuatu featuring registered evacuation centres, road networks, volcanic hazard zones, airports, ports, and health facilities.",
  keywords: [
    "Vanuatu GIS Map",
    "Vanuatu Evacuation Shelters Map",
    "DECM Cluster Spatial Data",
    "Vanuatu Road Network GIS",
    "Volcanic Hazard Mapping Tanna",
  ],
  openGraph: {
    title: "Interactive GIS & Spatial Mapping Portal | DECM Cluster Vanuatu",
    description:
      "Interactive spatial GIS mapping portal for Vanuatu featuring registered evacuation centres, road networks, volcanic hazard zones, airports, ports, and health facilities.",
  },
};

export default function MappingPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <MappingClient />
    </div>
  );
}
