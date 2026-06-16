import React from "react";
import { Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Active Partners — DECM Cluster Vanuatu",
  description: "Evacuation management agency focal points and cluster partners.",
};

export default function PartnersPage() {
  const partners = [
    { name: "Alice Toka", org: "NDMO Vanuatu", email: "atoka@vanuatu.gov.vu", role: "National Director" },
    { name: "John Obed", org: "IOM Vanuatu", email: "jobed@iom.int", role: "DECM Lead Coordinator" },
    { name: "Sarah Willie", org: "Red Cross Vanuatu", email: "swillie@redcross.org.vu", role: "Shelter Sub-Lead" },
    { name: "David Kalo", org: "Save the Children", email: "david.kalo@savethechildren.org", role: "Protection Officer" }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Active Partners</h2>
            <p className="text-xs text-muted-foreground mt-1">Evacuation management agency focal points and cluster partners</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cluster Focal Points</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {partners.map((partner, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{partner.name}</h4>
                <p className="text-[10px] text-primary font-extrabold mt-0.5">{partner.org}</p>
                <p className="text-[11px] text-muted-foreground mt-2">Role: {partner.role}</p>
                <a href={`mailto:${partner.email}`} className="text-[10px] text-muted-foreground hover:text-primary block mt-1 underline transition-colors">
                  {partner.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
