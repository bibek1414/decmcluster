"use client";

import React from "react";
import {
  ClipboardList,
  GraduationCap,
  BookOpen,
  Calendar,
  Globe,
  UserRoundCheck,
  FileLineChart,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModulesGrid() {
  const modules = [
    {
      title: "Assessment Tools",
      desc: "Standardized displacement and evacuation site validation assessment forms.",
      icon: ClipboardList,
      color: "border-t-blue-600 text-blue-600 dark:border-t-blue-500",
      items: [
        {
          name: "1.Evacuation Centre Assessment Form",
          path: "/assesments/0  Evacuation Centre Assessment Form.pdf",
          excelPath: "/csv/Evacuation Center Master List.xlsx",
        },
        {
          name: "2.Damage Assessment Form (Community V2)",
          path: "/assesments/1 Damage Assessment Form_ Community_Assessment_form_V2.pdf",
        },
        {
          name: "3.Rapid Assessment Form (Area Council)",
          path: "/assesments/2. Rapid Assessment Form- AreaCouncil_Assessment_Form.pdf",
        },
        {
          name: "4. Vanuatu Earthquake Displacement Tracking Matrix Form - Flow Monitoring",
          path: "/assesments/3. Vanuatu Earthquake Displacement Tracking Matrix Form - Flow Monitoring.pdf",
        },
        {
          name: "5.Displacement Profile - Phone Survey",
          path: "/assesments/4. Displacement Profile - Phone Survey.pdf",
        },
        {
          name: "6.IOM Vanuatu - Baseline Village Assessment v1",
          path: "/assesments/5. IOM Vanuatu - Baseline Village Assessment v1.pdf",
        },
        {
          name: "7.DECM Cluster - Service Monitoring Tool 2026",
          path: "/assesments/6. DECM Cluster - Service Monitoring Tool 2026.pdf",
        },
        {
          name: "8.Durable Solution & Relocation Survey",
          path: "/assesments/7. Durable Solution &amp; Relocation Survey_Vanuatu.pdf",
        },
      ],
    },
    {
      title: "Capacity Building & Training",
      desc: "Training curriculum, field guidelines, and manuals for teams and enumerators.",
      icon: GraduationCap,
      color: "border-t-emerald-600 text-emerald-600 dark:border-t-emerald-500",
      items: [
        "Enumerator Training Manual",
        "Displacement Tracking Standards",
        "Mobile Kobo Form Guidelines",
        "Provincial Officer Modules",
      ],
    },
    {
      title: "SOPs & Guidance",
      desc: "Standard operating procedures, data sharing protocols, and governance frameworks.",
      icon: BookOpen,
      color: "border-t-indigo-600 text-indigo-600 dark:border-t-indigo-500",
      items: [
        "DECM Data Sharing Agreement",
        "Site Management Guidelines",
        "Validation Workflows",
        "Reporting Calendar",
      ],
    },
    {
      title: "Project Updates",
      desc: "Live tracker for field implementation, key milestones, and cluster tasks.",
      icon: Calendar,
      color: "border-t-amber-600 text-amber-600 dark:border-t-amber-500",
      items: [
        "Provincial Deployment Plan",
        "2026 Quarter Deliverables",
        "Cluster Coordination Log",
        "Field Missions Schedule",
      ],
    },
    {
      title: "Web Forms",
      desc: "Browser-based online entry portals for field enumerators and focal points.",
      icon: Globe,
      color: "border-t-violet-600 text-violet-600 dark:border-t-violet-500",
      items: [
        "Mobile-friendly Web Forms",
        "Direct Kobo Integrations",
        "Partner Offline Form Packs",
        "Submit Ad-hoc Report",
      ],
    },
    {
      title: "User Management",
      desc: "Control administrative role-based access for NDMO, IOM, and partners.",
      icon: UserRoundCheck,
      color: "border-t-sky-600 text-sky-600 dark:border-t-sky-500",
      items: [
        "Partner Registry",
        "Role Assignment Panel",
        "Security Settings",
        "Audit Log Tracker",
      ],
    },
    {
      title: "Dashboards & Reports",
      desc: "Public and restricted reports, statistics, and situation analysis sheets.",
      icon: FileLineChart,
      color: "border-t-rose-650 text-rose-600 dark:border-t-rose-500",
      items: [
        "DECM Situation Updates",
        "Bi-annual Displacement Trends",
        "Data Quality Diagnostics",
        "Historic Database Archives",
      ],
    },
    {
      title: "Useful Links",
      desc: "Direct access keys to global partner directories and database networks.",
      icon: ExternalLink,
      color: "border-t-muted-foreground/60 text-muted-foreground",
      items: [
        {
          name: "KoboToolbox Server",
          path: "https://kobo.humanitarianresponse.info",
        },
        {
          name: "HDX Data - Vanuatu",
          path: "https://data.humdata.org/m/group/vut",
        },
        { name: "IOM DTM Portal", path: "https://dtm.iom.int/" },
        { name: "Global CCCM Cluster", path: "https://www.cccmcluster.org/" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-primary flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Cluster Management Modules
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Select and configure key database features and partner tools below
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <div
              key={index}
              className={cn(
                "bg-card text-card-foreground rounded-2xl p-6 border border-border border-t-4 flex flex-col justify-between transition-colors duration-300 min-h-[380px]",
                mod.color,
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="p-2.5 rounded-xl bg-muted border border-border">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    Module {index + 1}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-foreground mb-2">
                  {mod.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {mod.desc}
                </p>
              </div>

              {mod.items && (
                <div className="border-t border-border pt-4">
                  <ul className="space-y-1.5 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {mod.items.map((item, itemIdx) => {
                      const isObject = typeof item === "object";
                      const name = isObject ? (item as any).name : item;
                      const path = isObject ? (item as any).path : null;
                      const excelPath = isObject
                        ? (item as any).excelPath
                        : null;

                      return (
                        <li
                          key={itemIdx}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-medium"
                        >
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {path ? (
                              <a
                                href={path}
                                download
                                className="hover:underline flex items-center gap-1 "
                              >
                                {name}
                                <span className="text-[10px] text-primary/60 font-bold">
                                  (PDF)
                                </span>
                              </a>
                            ) : (
                              <span>{name}</span>
                            )}
                            {excelPath && (
                              <a
                                href={excelPath}
                                download
                                className="text-[10px] text-green-600 hover:underline font-bold border-l border-border pl-2"
                              >
                                XLSX
                              </a>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
