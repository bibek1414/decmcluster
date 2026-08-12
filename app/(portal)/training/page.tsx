import TrainingClient from "@/components/training/training-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training & Capacity Building",
  description:
    "Disaster risk management training courses, evacuation shelter management e-learning, field enumeration modules, and capacity building for Vanuatu NDMO.",
  keywords: [
    "DECM Training Vanuatu",
    "Evacuation Centre Management Training",
    "Displacement Enumeration Course",
    "NDMO Capacity Building",
  ],
  openGraph: {
    title: "Training & Capacity Building | DECM Cluster Vanuatu",
    description:
      "Disaster risk management training courses, evacuation shelter management e-learning, field enumeration modules, and capacity building for Vanuatu NDMO.",
  },
};

export default function TrainingPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <TrainingClient />
    </div>
  );
}
