import React from "react";
import { 
  Tent, 
  Database, 
  Map, 
  PieChart, 
  FileCheck, 
  Download 
} from "lucide-react";

interface OverviewSectionProps {
  onQuickLinkClick: (sectionId: string) => void;
}

export default function OverviewSection({ onQuickLinkClick }: OverviewSectionProps) {
  const quickLinks = [
    { label: "EC Tracking", icon: Tent, id: "dashboard", subTab: "Evacuation Centres" },
    { label: "Data Registry", icon: Database, id: "assessments" },
    { label: "GIS Mapping", icon: Map, id: "mapping" },
    { label: "Analysis", icon: PieChart, id: "dashboard", subTab: "Summary" },
    { label: "SOPs", icon: FileCheck, id: "sops" },
    { label: "Export Data", icon: Download, id: "reports" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
        Portal Overview
      </h2>
      <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
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
        <h3 className="text-xs font-bold text-slate-400 mb-4">
          Quick Access Portal Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => onQuickLinkClick(link.id)}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100/60 hover:border-blue-200 text-blue-900 transition-all duration-200 cursor-pointer text-center group shadow-sm hover:shadow"
              >
                <div className="p-2 rounded-lg bg-white border border-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-200 mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-tight">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
