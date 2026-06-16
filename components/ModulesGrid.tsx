import React from "react";
import { 
  ClipboardList, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Globe, 
  UserRoundCheck, 
  FileLineChart, 
  ExternalLink 
} from "lucide-react";

export default function ModulesGrid() {
  const modules = [
    {
      title: "Assessment Tools",
      desc: "Standardized displacement and evacuation site validation assessment forms.",
      icon: ClipboardList,
      color: "border-blue-600 text-blue-600",
      items: [
        "Village Level Assessments",
        "Post Distribution Monitoring",
        "Rapid Service Mapping",
        "Evacuation Centre Auditing"
      ]
    },
    {
      title: "Capacity Building & Training",
      desc: "Training curriculum, field guidelines, and manuals for teams and enumerators.",
      icon: GraduationCap,
      color: "border-emerald-600 text-emerald-600",
      items: [
        "Enumerator Training Manual",
        "Displacement Tracking Standards",
        "Mobile Kobo Form Guidelines",
        "Provincial Officer Modules"
      ]
    },
    {
      title: "SOPs & Guidance",
      desc: "Standard operating procedures, data sharing protocols, and governance frameworks.",
      icon: BookOpen,
      color: "border-indigo-600 text-indigo-600",
      items: [
        "DECM Data Sharing Agreement",
        "Site Management Guidelines",
        "Validation Workflows",
        "Reporting Calendar"
      ]
    },
    {
      title: "Project Updates",
      desc: "Live tracker for field implementation, key milestones, and cluster tasks.",
      icon: Calendar,
      color: "border-amber-600 text-amber-600",
      items: [
        "Provincial Deployment Plan",
        "2026 Quarter Deliverables",
        "Cluster Coordination Log",
        "Field Missions Schedule"
      ]
    },
    {
      title: "Web Forms",
      desc: "Browser-based online entry portals for field enumerators and focal points.",
      icon: Globe,
      color: "border-violet-600 text-violet-600",
      items: [
        "Mobile-friendly Web Forms",
        "Direct Kobo Integrations",
        "Partner Offline Form Packs",
        "Submit Ad-hoc Report"
      ]
    },
    {
      title: "User Management",
      desc: "Control administrative role-based access for NDMO, IOM, and partners.",
      icon: UserRoundCheck,
      color: "border-sky-600 text-sky-600",
      items: [
        "Partner Registry",
        "Role Assignment Panel",
        "Security Settings",
        "Audit Log Tracker"
      ]
    },
    {
      title: "Dashboards & Reports",
      desc: "Public and restricted reports, statistics, and situation analysis sheets.",
      icon: FileLineChart,
      color: "border-rose-600 text-rose-700",
      items: [
        "DECM Situation Updates",
        "Bi-annual Displacement Trends",
        "Data Quality Diagnostics",
        "Historic Database Archives"
      ]
    },
    {
      title: "Useful Links",
      desc: "Direct access keys to global partner directories and database networks.",
      icon: ExternalLink,
      color: "border-slate-600 text-slate-600",
      items: [
        "KoboToolbox Server",
        "DHIS2 Vanuatu Health Portal",
        "Humanitarian Data Exchange (HDX)",
        "ReliefWeb Vanuatu Listings"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Cluster Management Modules
        </h2>
        <p className="text-xs text-slate-500 mt-1">Select and configure key database features and partner tools below</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-6 border-t-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between ${mod.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    Module {index + 1}
                  </span>
                </div>
                
                <h3 className="text-base font-extrabold text-blue-950 mb-2">
                  {mod.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {mod.desc}
                </p>
              </div>

              {mod.items && (
                <ul className="space-y-1.5 border-t border-slate-100 pt-4">
                  {mod.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs text-slate-600 hover:text-blue-900 transition-colors flex items-center gap-1.5 font-medium">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
