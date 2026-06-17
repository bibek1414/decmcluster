import ResponseTrackingClient from "@/components/ResponseTrackingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Response Tracking — DECM Cluster Vanuatu",
  description: "Reporting templates, situation reports, and response data.",
};

export default function ResponseTrackingPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <ResponseTrackingClient />
    </div>
  );
}

