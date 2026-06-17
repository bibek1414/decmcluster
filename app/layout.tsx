import type { Metadata } from "next";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DECM Cluster Vanuatu — Information Management & Data Portal",
  description:
    "Displacement, Evacuation Centre and Response Information System for NDMO, IOM and Partners in Vanuatu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full  flex flex-col font-sans">
        <Providers>
          {/* Header Panel */}
          <Header />

          {/* Main Navigation */}
          <Navigation />

          {/* Main Container */}
          <main className="flex-grow">{children}</main>

          {/* Footer Panel */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

