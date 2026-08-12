import type { Metadata } from "next";
import Providers from "@/providers";
import "./globals.css";

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
    "GIS Mapping Vanuatu",
    "Displacement Information System",
    "Pacific Humanitarian Response",
  ],
  openGraph: {
    title: "DECM Cluster Vanuatu — Information Management & Spatial Data Portal",
    description:
      "Official Displacement, Evacuation Centre, and Emergency Response Management System for NDMO, IOM, and Humanitarian Partners in Vanuatu.",
    url: baseUrl,
    siteName: "DECM Cluster Vanuatu",
    locale: "en_VU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
