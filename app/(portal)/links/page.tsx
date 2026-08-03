import LinksClient from "@/components/links/links-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Useful Links — DECM Cluster Vanuatu",
  description: "Direct access keys to global partner networks and databases.",
};

export default function LinksPage() {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 animate-fadeIn">
      <LinksClient />
    </div>
  );
}
