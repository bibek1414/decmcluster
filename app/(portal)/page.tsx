import Hero from "@/components/layout/hero";
import BannersSection from "@/components/dashboard/banners-section";
import OverviewSection from "@/components/dashboard/overview-section";
import LoginCard from "@/components/auth/login-card";
import DashboardSection from "@/components/dashboard/dashboard-section";
import HomePowerBISection from "@/components/dashboard/home-powerbi-section";
import ModulesGrid from "@/components/dashboard/modules-grid";
import ReportsSection from "@/components/dashboard/reports-section";
import ScrollAnimate from "@/components/shared/scroll-animate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Information Management & Data Portal",
  description:
    "Official Displacement, Evacuation Centre, and Emergency Response Information Portal for National Disaster Management Office (NDMO), IOM, and Partners in Vanuatu.",
  keywords: [
    "DECM Cluster Vanuatu",
    "NDMO Vanuatu Portal",
    "Displacement Information System",
    "Evacuation Centre Management Vanuatu",
    "Vanuatu Emergency Response",
  ],
  openGraph: {
    title: "Information Management & Data Portal | DECM Cluster Vanuatu",
    description:
      "Official Displacement, Evacuation Centre, and Emergency Response Information Portal for National Disaster Management Office (NDMO), IOM, and Partners in Vanuatu.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />

      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-8">
        <ScrollAnimate>
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-2 xl:col-span-3">
              <OverviewSection />
            </div>
            <div className="lg:col-span-1 xl:col-span-1">
              <LoginCard />
            </div>
          </div>
        </ScrollAnimate>

        <ScrollAnimate>
          <DashboardSection isHomePage={true} />
        </ScrollAnimate>

        <ScrollAnimate>
          <HomePowerBISection />
        </ScrollAnimate>

        <ScrollAnimate>
          <BannersSection />
        </ScrollAnimate>

        <ScrollAnimate>
          <ReportsSection />
        </ScrollAnimate>
        <ScrollAnimate>
          <ModulesGrid />
        </ScrollAnimate>
      </div>

      {/* Full Width Banner */}
    </div>
  );
}
