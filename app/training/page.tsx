import TrainingClient from "@/components/training/training-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training & Capacity — DECM Cluster Vanuatu",
  description: "E-learning resources, modules, and field enumeration guidelines.",
};

export default function TrainingPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <TrainingClient />
    </div>
  );
}
