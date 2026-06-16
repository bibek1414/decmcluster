import React from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training & Capacity — DECM Cluster Vanuatu",
  description: "E-learning resources, modules, and field enumeration guidelines.",
};

export default function TrainingPage() {
  const modules = [
    { title: "Module 1: Introduction to DECM Standards", hours: "2 hrs", difficulty: "Beginner" },
    { title: "Module 2: Field Enumeration using KoboCollect", hours: "4 hrs", difficulty: "Intermediate" },
    { title: "Module 3: GIS Coordinates Mapping on Mobile", hours: "3.5 hrs", difficulty: "Intermediate" },
    { title: "Module 4: Cluster Response Coordination & Reporting", hours: "5 hrs", difficulty: "Advanced" }
  ];

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Training & Capacity Building</h2>
            <p className="text-xs text-muted-foreground mt-1">E-learning resources, modules and field guidelines</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground">Available Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">{mod.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Duration: {mod.hours} | Level: {mod.difficulty}</p>
                </div>
                <Button size="sm" className="shrink-0 cursor-pointer">
                  Start Course
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
