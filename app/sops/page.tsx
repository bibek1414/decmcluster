import SopsClient from "@/components/sops/sops-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOPs & Guidelines — DECM Cluster Vanuatu",
  description: "Core operating guidelines, role matrix, and disaster management templates.",
};

export default function SopsPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <SopsClient />
    </div>
  );
}
