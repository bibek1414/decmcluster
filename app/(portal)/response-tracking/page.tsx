import ResponseTrackingClient from "@/components/response-tracking/response-tracking-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Response & 5W Tracking Matrix",
  description:
    "5W humanitarian response tracking matrix, relief supply distribution tracking, emergency sector monitoring, and operational status in Vanuatu.",
  keywords: [
    "Vanuatu 5W Response Matrix",
    "DECM Response Tracking",
    "Relief Distribution Vanuatu",
    "Humanitarian Operational Status NDMO",
  ],
  openGraph: {
    title: "Emergency Response & 5W Tracking Matrix | DECM Cluster Vanuatu",
    description:
      "5W humanitarian response tracking matrix, relief supply distribution tracking, emergency sector monitoring, and operational status in Vanuatu.",
  },
};

export default function ResponseTrackingPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <ResponseTrackingClient />
    </div>
  );
}
