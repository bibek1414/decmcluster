import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import Providers from "@/providers";
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
