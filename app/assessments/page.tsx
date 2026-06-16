import React from "react";
import { ClipboardList, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Tools — DECM Cluster Vanuatu",
  description: "Field survey forms, data schemas, and mobile templates.",
};

export default function AssessmentsPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">Assessment Tools</h2>
            <p className="text-xs text-muted-foreground mt-1">Field survey forms, data schemas and mobile templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-0 sm:border border-border rounded-none sm:rounded-xl p-0 sm:p-5 bg-transparent sm:bg-muted/30 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground">Mobile Survey Forms</h3>
            <p className="text-xs text-muted-foreground">
              Assessments are configured using KoboToolbox. Scan the code on-site or use the web forms to submit data offline.
            </p>
            <div className="space-y-2">
              {[
                "Village Rapid Assessment Form (V1.4)",
                "Evacuation Centre Capacity Form (V2.1)",
                "Post-Distribution Monitoring Checklist",
                "Basic WASH Assessment Survey"
              ].map((form, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between text-xs font-bold text-card-foreground">
                  <span>{form}</span>
                  <button className="text-[10px] text-primary hover:underline font-extrabold cursor-pointer">
                    Get XLSForm
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-0 sm:border border-border rounded-none sm:rounded-xl p-0 sm:p-5 bg-transparent sm:bg-muted/30 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground">Data Import & Schema</h3>
            <p className="text-xs text-muted-foreground">
              Upload CSV/Excel spreadsheets manually to process raw assessment reports.
            </p>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card">
              <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <span className="text-xs text-foreground font-bold block mb-1">Drag and drop file here</span>
              <span className="text-[10px] text-muted-foreground">Only .csv or .xlsx files are supported</span>
              <div>
                <Button className="mt-4 cursor-pointer" size="sm">
                  Browse File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
