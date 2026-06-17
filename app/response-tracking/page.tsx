import {
  FileText,
  ClipboardCheck,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Response Tracking — DECM Cluster Vanuatu",
  description: "Reporting templates, situation reports, and response data.",
};

export default function ResponseTrackingPage() {
  const modules = [
    {
      title: "Sw Reporting Templates",
      desc: "Standardized sector-wide templates for tracking field activities and progress.",
      icon: FileText,
      color: "border-t-blue-600 text-blue-600 dark:border-t-blue-500",
      items: [
        "Weekly Progress Report",
        "Activity Log",
        "Partner Submission Form",
      ],
    },
    {
      title: "Situation Report Templates",
      desc: "Official templates for emergency situation updates and cluster briefings.",
      icon: ClipboardCheck,
      color: "border-t-emerald-600 text-emerald-600 dark:border-t-emerald-500",
      items: [
        {
          name: "Flash SitRep (PPTX)",
          path: "/response-tracking/Displacement-Evacuation-Center-Management-DECM-Cluster Sitrep Template.pptx",
        },
        { name: "Weekly Cluster Update", path: "#" },
        { name: "Donor Briefing Note", path: "#" },
      ],
    },
    {
      title: "SW Response data",
      desc: "Live datasets and visualization of ongoing field responses across all sectors.",
      icon: BarChart3,
      color: "border-t-rose-600 text-rose-600 dark:border-t-rose-500",
      items: [
        {
          name: "5W Response Tracking Tool (XLSX)",
          path: "/response-tracking/Response Tracking Tool 5W DECM Cluster.xlsx",
        },
        { name: "Current Response Stats", path: "#" },
        { name: "Distribution Tracker", path: "#" },
      ],
    },
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="space-y-8">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              Response Tracking
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Sector-wide reporting templates and field response data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className={cn(
                  "bg-card text-card-foreground rounded-2xl p-6 border border-border border-t-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md",
                  mod.color,
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-muted border border-border">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Module 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-foreground mb-2">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {mod.desc}
                  </p>
                </div>

                {mod.items && (
                  <ul className="space-y-2 border-t border-border pt-4">
                    {mod.items.map((item, itemIdx) => {
                      const isLink =
                        typeof item === "object" && item.path !== "#";
                      const label = typeof item === "object" ? item.name : item;
                      const path = typeof item === "object" ? item.path : "#";

                      return (
                        <li
                          key={itemIdx}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-between font-medium group cursor-pointer"
                        >
                          {isLink ? (
                            <a
                              href={path}
                              download
                              className="flex items-center justify-between w-full group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors"></span>
                                <span>{label}</span>
                              </div>
                              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                Download{" "}
                              </span>
                            </a>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
                                <span>{label}</span>
                              </div>
                              <span className="text-[10px] opacity-20 font-bold italic">
                                TBA
                              </span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
