import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://decm-vanuatu.gov.vu";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DECM Cluster Vanuatu — Information Management & Spatial Data Portal",
    template: "%s | DECM Cluster Vanuatu",
  },
  description:
    "Official Displacement, Evacuation Centre, and Emergency Response Management System for NDMO, IOM, and Humanitarian Partners in Vanuatu.",
  keywords: [
    "DECM Cluster Vanuatu",
    "NDMO Vanuatu",
    "Vanuatu Evacuation Centres",
    "Vanuatu Disaster Risk Reduction",
    "GIS Mapping Vanuatu",
    "Emergency Shelter Vanuatu",
    "Displacement Tracking Matrix DTM",
    "Shefa Province Spatial Data",
    "Sanma Province Spatial Data",
    "HumData Vanuatu",
    "Pacific Data Hub",
  ],
  authors: [{ name: "DECM Cluster Vanuatu", url: baseUrl }],
  creator: "National Disaster Management Office (NDMO) Vanuatu & IOM",
  publisher: "DECM Cluster Vanuatu",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DECM Cluster Vanuatu — Information Management & Spatial Data Portal",
    description:
      "Official Displacement, Evacuation Centre, and Emergency Response Management System for NDMO, IOM, and Humanitarian Partners in Vanuatu.",
    url: baseUrl,
    siteName: "DECM Cluster Vanuatu",
    locale: "en_VU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DECM Cluster Vanuatu — Information Management & Spatial Data Portal",
    description:
      "Official Displacement, Evacuation Centre, and Emergency Response Management System for NDMO, IOM, and Humanitarian Partners in Vanuatu.",
  },
};

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Header Panel */}
      <Header />

      {/* Main Navigation */}
      <Navigation />

      {/* Main Container */}
      <main className="flex-grow">{children}</main>

      {/* Footer Panel */}
      <Footer />
    </>
  );
}
