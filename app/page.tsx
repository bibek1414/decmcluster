import Hero from "@/components/layout/hero";
import BannersSection from "@/components/dashboard/banners-section";
import OverviewSection from "@/components/dashboard/overview-section";
import LoginCard from "@/components/auth/login-card";
import DashboardSection from "@/components/dashboard/dashboard-section";
import ModulesGrid from "@/components/dashboard/modules-grid";
import ReportsSection from "@/components/dashboard/reports-section";
import ScrollAnimate from "@/components/shared/scroll-animate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DECM Cluster Vanuatu — Information Management & Data Portal",
  description:
    "Displacement, Evacuation Centre and Response Information System for NDMO, IOM and Partners in Vanuatu.",
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ScrollAnimate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OverviewSection />
            </div>
            <div className="lg:col-span-1">
              <LoginCard />
            </div>
          </div>
        </ScrollAnimate>

        <ScrollAnimate>
          <DashboardSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <ModulesGrid />
        </ScrollAnimate>
      </div>

      {/* Full Width Banner */}
      <ScrollAnimate>
        <BannersSection />
      </ScrollAnimate>

      <ScrollAnimate>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportsSection />
        </div>
      </ScrollAnimate>
    </div>
  );
}
