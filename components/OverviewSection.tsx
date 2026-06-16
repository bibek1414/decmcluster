import React from "react";
import Link from "next/link";
import { 
  Tent, 
  Database, 
  Map, 
  PieChart, 
  FileCheck, 
  Download 
} from "lucide-react";

export default function OverviewSection() {
  const quickLinks = [
    { label: "EC Tracking", icon: Tent, path: "/dashboard" },
    { label: "Data Registry", icon: Database, path: "/assessments" },
    { label: "GIS Mapping", icon: Map, path: "/mapping" },
    { label: "Analysis", icon: PieChart, path: "/dashboard" },
    { label: "SOPs", icon: FileCheck, path: "/sops" },
    { label: "Export Data", icon: Download, path: "/reports" },
  ];

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border transition-colors duration-300">
      <h2 className="text-xl sm:text-2xl font-extrabold text-primary mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Portal Overview
      </h2>
      <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
        <p>
          The DECM Cluster Information Management and Data Portal provides a central platform for managing
          displacement-related information across preparedness, emergency response, recovery, and durable
          solutions work in Vanuatu. It can be used by NDMO, IOM, provincial authorities, and cluster partners
          to collect, validate, analyze, export, and share operational information in a consistent format.
        </p>
        <p>
          The portal can later be connected with KoboToolbox, web forms, dashboards, GIS maps, user-based access,
          evacuation centre databases, historical disaster datasets, and partner response tracking tools.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-xs font-bold text-muted-foreground mb-4">
          Quick Access Portal Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.path}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border text-primary transition-all duration-200 cursor-pointer text-center group"
              >
                <div className="p-2 rounded-lg bg-card border border-border text-primary group-hover:scale-105 transition-transform duration-200 mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-tight">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
