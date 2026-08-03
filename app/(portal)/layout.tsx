import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";

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
