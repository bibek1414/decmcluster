"use client";

import React, { useState } from "react";
import {
  Map,
  Globe2,
  AlertTriangle,
  Flame,
  Tent,
  Navigation,
  Wind,
  Info,
  Layers,
} from "lucide-react";

interface MapItem {
  id: string;
  type: "center" | "hazard" | "road" | "volcano";
  title: string;
  desc: string;
  stats?: Record<string, string | number>;
}

export default function MappingClient() {
  const [layers, setLayers] = useState({
    centers: true,
    tcHazard: false,
    roads: false,
    volcano: false,
  });

  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleItemClick = (item: MapItem) => {
    setSelectedItem(item);
  };

  // Coordinates data for mapping overlay visual items
  const evacuationCenters: MapItem[] = [
    {
      id: "ec-1",
      type: "center",
      title: "Port Vila Area Council Hall",
      desc: "Primary evacuation hub in Shefa province, fully stocked with WASH kits and temporary shelter partition kits.",
      stats: {
        province: "Shefa",
        status: "Open",
        capacity_hhs: 220,
        type: "Community Hall",
      },
    },
    {
      id: "ec-2",
      type: "center",
      title: "Luganville Community Centre",
      desc: "Emergency relief staging site in Sanma province with standby generators and food rations.",
      stats: {
        province: "Sanma",
        status: "Open",
        capacity_hhs: 185,
        type: "School",
      },
    },
    {
      id: "ec-3",
      type: "center",
      title: "Isangel School Compound",
      desc: "Active monitoring shelter in Tafea. Access roads are cleared, medical officers on standby.",
      stats: {
        province: "Tafea",
        status: "Monitoring",
        capacity_hhs: 95,
        type: "School",
      },
    },
    {
      id: "ec-4",
      type: "center",
      title: "Lakatoro Church Hall",
      desc: "Worship center converted to a central distribution depot for Malampa province displaced families.",
      stats: {
        province: "Malampa",
        status: "Open",
        capacity_hhs: 130,
        type: "Church",
      },
    },
  ];

  const blockedRoad: MapItem = {
    id: "road-1",
    type: "road",
    title: "Sarakata River Bridge Closure",
    desc: "Severe flooding has submerged the low-crossing bridge structure. All vehicle traffic is currently suspended.",
    stats: {
      province: "Sanma",
      river_level: "High (+2.4m)",
      reroute: "East Bypass Rd",
      status: "Closed",
    },
  };

  const volcanoAlert: MapItem = {
    id: "volcano-1",
    type: "volcano",
    title: "Mount Ambae Volcano Warning",
    desc: "Vanuatu Meteorology and Geo-Hazards Department (VMGD) reports active steam and ash emissions.",
    stats: {
      location: "Ambae Island",
      alert_level: "Level 2",
      safety_radius: "2km",
      hazard: "Ash Fall",
    },
  };

  const tcHazardZone: MapItem = {
    id: "tc-1",
    type: "hazard",
    title: "Cyclone Judy/Kevin Track",
    desc: "Historic Category 4 cyclone trajectory showing the high wind-speed warning boundary and coastal surge zones.",
    stats: {
      pressure: "945 hPa",
      wind_speed: "165 km/h",
      surge_risk: "Extreme",
      storm_category: "Cat 4",
    },
  };

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      {/* Header section */}
      <div className="border-b border-border pb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary">
              GIS & Spatial Mapping
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Interactive coordinates and evacuation shelter mapping
            </p>
          </div>
        </div>
      </div>

      {/* Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Window (Left 2 cols) */}
        <div className="lg:col-span-2 bg-muted/40 rounded-xl border border-border h-[460px] flex items-center justify-center relative overflow-hidden group select-none">
          {/* Topographic Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map Compass Rose */}
          <div className="absolute bottom-4 left-4 p-2 rounded-lg bg-card/80 border border-border/80 backdrop-blur-sm flex flex-col items-center justify-center text-[10px] text-muted-foreground font-semibold shadow-sm pointer-events-none">
            <Navigation className="w-4 h-4 text-primary mb-1 rotate-[45deg]" />
            <span>GIS-M PORTAL</span>
          </div>

          {/* SVG Map Archipelago representation */}
          <div className="relative w-72 h-[400px]">
            <svg
              className="w-full h-full"
              viewBox="0 0 200 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Vanuatu Island Shapes (SVG Paths) */}
              <g className="text-muted-foreground/35">
                {/* Torba */}
                <circle
                  cx="70"
                  cy="30"
                  r="10"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />
                <circle
                  cx="95"
                  cy="22"
                  r="6"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />

                {/* Sanma (Luganville / Espiritu Santo) */}
                <polygon
                  points="25,75 55,60 65,95 30,110"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />

                {/* Penama (Ambae & Pentecost) */}
                <path
                  d="M 85,68 Q 95,78 92,98 Q 80,92 85,68 Z"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />

                {/* Malampa (Malekula & Ambrym) */}
                <polygon
                  points="45,115 70,105 80,135 50,145"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />
                <circle
                  cx="90"
                  cy="125"
                  r="8"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />

                {/* Shefa (Efate / Port Vila) */}
                <path
                  d="M 105,170 Q 125,175 118,192 Q 102,188 105,170 Z"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />

                {/* Tafea (Tanna & Erromango) */}
                <circle
                  cx="125"
                  cy="215"
                  r="9"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />
                <polygon
                  points="135,240 155,250 145,268 128,255"
                  className="fill-current hover:text-primary/20 transition-colors cursor-pointer"
                />
              </g>

              {/* Volcano Ash Layer (Overlay) */}
              {layers.volcano && (
                <g className="animate-pulse">
                  {/* Ash dispersion radius */}
                  <circle
                    cx="88"
                    cy="85"
                    r="24"
                    className="fill-amber-500/10 stroke-amber-500/30 stroke-dasharray-[2,2] cursor-pointer"
                    onClick={() => handleItemClick(volcanoAlert)}
                  />
                  {/* Active Volcano Pin */}
                  <circle
                    cx="88"
                    cy="85"
                    r="4"
                    className="fill-amber-600 stroke-amber-200 cursor-pointer"
                    onClick={() => handleItemClick(volcanoAlert)}
                  />
                </g>
              )}

              {/* Cyclone Track Layer (Overlay) */}
              {layers.tcHazard && (
                <g className="opacity-80">
                  {/* Cyclone center track line */}
                  <path
                    d="M 180,25 Q 120,90 98,180 T 50,270"
                    fill="none"
                    stroke="url(#stormGradient)"
                    strokeWidth="3"
                    className="stroke-rose-500/50 cursor-pointer"
                    onClick={() => handleItemClick(tcHazardZone)}
                  />
                  {/* Outer impact zone circle */}
                  <circle
                    cx="120"
                    cy="90"
                    r="35"
                    className="fill-rose-500/5 stroke-rose-500/20 stroke-1 cursor-pointer"
                    onClick={() => handleItemClick(tcHazardZone)}
                  />
                  {/* Cyclone Eye marker */}
                  <g
                    transform="translate(120, 90) rotate(45)"
                    className="cursor-pointer"
                    onClick={() => handleItemClick(tcHazardZone)}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="6"
                      className="fill-rose-600 animate-ping opacity-75"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="4"
                      className="fill-rose-700 stroke-rose-100"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="stormGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                      <stop
                        offset="50%"
                        stopColor="#f43f5e"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor="#e11d48"
                        stopOpacity="0.2"
                      />
                    </linearGradient>
                  </defs>
                </g>
              )}

              {/* Road Network & Bridge Warning Layer (Overlay) */}
              {layers.roads && (
                <g>
                  {/* Road paths connecting Sanma */}
                  <path
                    d="M 28,88 L 48,80 L 58,95"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                    strokeDasharray="3,1.5"
                  />
                  {/* Blocked bridge coordinates */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleItemClick(blockedRoad)}
                  >
                    {/* Ring ping */}
                    <circle
                      cx="48"
                      cy="80"
                      r="5"
                      className="fill-rose-500/30 stroke-rose-500 animate-ping"
                    />
                    <circle
                      cx="48"
                      cy="80"
                      r="3"
                      className="fill-rose-600 stroke-rose-100"
                    />
                  </g>
                </g>
              )}

              {/* Evacuation Centers (Overlay) */}
              {layers.centers && (
                <g>
                  {/* Port Vila (Shefa) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleItemClick(evacuationCenters[0])}
                  >
                    <circle
                      cx="112"
                      cy="182"
                      r="5"
                      className="fill-emerald-500 animate-pulse opacity-90"
                    />
                    <circle
                      cx="112"
                      cy="182"
                      r="3.5"
                      className="fill-emerald-600 stroke-emerald-100"
                    />
                  </g>

                  {/* Luganville (Sanma) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleItemClick(evacuationCenters[1])}
                  >
                    <circle
                      cx="46"
                      cy="85"
                      r="5"
                      className="fill-emerald-500 animate-pulse opacity-90"
                    />
                    <circle
                      cx="46"
                      cy="85"
                      r="3.5"
                      className="fill-emerald-600 stroke-emerald-100"
                    />
                  </g>

                  {/* Isangel (Tafea) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleItemClick(evacuationCenters[2])}
                  >
                    <circle
                      cx="142"
                      cy="254"
                      r="5"
                      className="fill-amber-500 animate-pulse opacity-90"
                    />
                    <circle
                      cx="142"
                      cy="254"
                      r="3.5"
                      className="fill-amber-600 stroke-amber-100"
                    />
                  </g>

                  {/* Lakatoro (Malampa) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => handleItemClick(evacuationCenters[3])}
                  >
                    <circle
                      cx="62"
                      cy="125"
                      r="5"
                      className="fill-emerald-500 animate-pulse opacity-90"
                    />
                    <circle
                      cx="62"
                      cy="125"
                      r="3.5"
                      className="fill-emerald-600 stroke-emerald-100"
                    />
                  </g>
                </g>
              )}

              {/* Static Island Labels */}
              <g className="pointer-events-none select-none font-bold fill-foreground/30 text-[9px]">
                <text x="82" y="32">
                  Torba
                </text>
                <text x="14" y="96">
                  Sanma
                </text>
                <text x="96" y="98">
                  Penama
                </text>
                <text x="46" y="142">
                  Malampa
                </text>
                <text x="122" y="190">
                  Shefa
                </text>
                <text x="144" y="246">
                  Tafea
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Sidebar Controls & Inspector (Right 1 col) */}
        <div className="space-y-6">
          {/* Layer Controls Panel */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Layers className="w-3.5 h-3.5" />
              <span>Map Controls & Layers</span>
            </div>

            <div className="space-y-2.5">
              {/* Evacuation Center Layer checkbox */}
              <div
                onClick={() => toggleLayer("centers")}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  layers.centers
                    ? "bg-primary/5 border-primary/20 text-primary-foreground"
                    : "bg-card border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg border ${layers.centers ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    <Tent className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Evacuation Centers
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Locations of all active registered shelters
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={layers.centers}
                  onChange={() => {}} // Controlled via click handler on parent container
                  className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 mt-0.5 pointer-events-none"
                />
              </div>

              {/* Cyclone Hazard Layer checkbox */}
              <div
                onClick={() => toggleLayer("tcHazard")}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  layers.tcHazard
                    ? "bg-primary/5 border-primary/20 text-primary-foreground"
                    : "bg-card border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg border ${layers.tcHazard ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      TC Hazard Impact Zone
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Wind speeds & surge hazard boundaries
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={layers.tcHazard}
                  onChange={() => {}}
                  className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 mt-0.5 pointer-events-none"
                />
              </div>

              {/* Roads Accessibility Layer checkbox */}
              <div
                onClick={() => toggleLayer("roads")}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  layers.roads
                    ? "bg-primary/5 border-primary/20 text-primary-foreground"
                    : "bg-card border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg border ${layers.roads ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Road Network Warnings
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Track blocked bridge and river crossings
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={layers.roads}
                  onChange={() => {}}
                  className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 mt-0.5 pointer-events-none"
                />
              </div>

              {/* Volcano Warning Layer checkbox */}
              <div
                onClick={() => toggleLayer("volcano")}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 cursor-pointer transition-all duration-200 ${
                  layers.volcano
                    ? "bg-primary/5 border-primary/20 text-primary-foreground"
                    : "bg-card border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg border ${layers.volcano ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"}`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Volcanic Ash Fall Zones
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Warning zones around active volcanos
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={layers.volcano}
                  onChange={() => {}}
                  className="rounded border-input text-primary focus:ring-ring h-3.5 w-3.5 mt-0.5 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Details Inspector Panel */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Info className="w-3.5 h-3.5" />
              <span>Layer Feature Inspector</span>
            </div>

            {selectedItem ? (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-fadeIn relative">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-extrabold text-primary leading-tight">
                    {selectedItem.title}
                  </h4>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-0.5 rounded font-bold cursor-pointer transition-colors border border-border"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {selectedItem.desc}
                </p>
                {selectedItem.stats && (
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border text-[10px]">
                    {Object.entries(selectedItem.stats).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-muted-foreground font-semibold block capitalize">
                          {key.replace("_", " ")}
                        </span>
                        <span className="font-extrabold text-foreground">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground bg-muted/20">
                Click a map layer feature dot or shape to view operational
                parameters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
