import Hero from "@/components/Hero";
import OverviewSection from "@/components/OverviewSection";
import LoginCard from "@/components/auth/login-card";
import DashboardSection from "@/components/DashboardSection";
import ModulesGrid from "@/components/ModulesGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DECM Cluster Vanuatu — Information Management & Data Portal",
  description:
    "Displacement, Evacuation Centre and Response Information System for NDMO, IOM and Partners in Vanuatu.",
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        {/* Top Grid: Overview + Login */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewSection />
          </div>
          <div className="lg:col-span-1">
            <LoginCard />
          </div>
        </div>

        {/* Dashboard Section */}
        <DashboardSection />

        {/* Modules Grid */}
        <ModulesGrid />
      </div>
    </div>
  );
}
