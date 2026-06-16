import React from "react";
import { Map, Globe2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GIS & Spatial Mapping — DECM Cluster Vanuatu",
  description: "Interactive coordinates and evacuation shelter mapping.",
};

export default function MappingPage() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
        <div className="border-b border-border pb-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">GIS & Spatial Mapping</h2>
            <p className="text-xs text-muted-foreground mt-1">Interactive coordinates and evacuation shelter mapping</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-muted/40 rounded-xl border border-border h-96 flex items-center justify-center relative overflow-hidden group">
            {/* SVG decorative background grid lines simulating topographic map */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="text-center space-y-3 p-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-card border border-border text-primary flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200">
                <Globe2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-primary">GIS Layer Integration</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Active connection to Esri ArcGIS and Mapbox APIs. View live shelter capacity and hazard maps.
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                Open Map Portal
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Map Controls & Layers</h3>
            <div className="space-y-2.5">
              {[
                { label: "Evacuation Center Locations", desc: "Coordinates of all 86 registered sites", active: true },
                { label: "TC Hazard Impact Zone", desc: "Wind speeds & storm surge levels", active: false },
                { label: "Road Network Accessibility", desc: "Track blocked bridge crossings", active: false },
                { label: "Volcanic Ash Fall Zones", desc: "Ambae & Lopevi warning layers", active: false }
              ].map((layer, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-card flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{layer.label}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{layer.desc}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={layer.active}
                    className="rounded border-input text-primary focus:ring-ring h-4 w-4 mt-0.5 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
