"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  Search,
  Download,
  ExternalLink,
  MapPin,
  Mountain,
  Waves,
  Layers,
  FileSpreadsheet,
  FileCode,
  Globe,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export interface VolcanoData {
  name: string;
  elevation_m: number;
  elevation_ft: number;
  latitude: number;
  longitude: number;
  location_dms: string;
  last_eruption: string;
  type: string;
  island: string;
  province: string;
  status: string;
}

const VANUATU_VOLCANOES: VolcanoData[] = [
  {
    name: "Ambae",
    elevation_m: 1496,
    elevation_ft: 4908,
    latitude: -15.38,
    longitude: 167.83,
    location_dms: "15.380°S 167.83°E",
    last_eruption: "2017",
    type: "Active Shield / Caldera (Manaro Voui)",
    island: "Ambae",
    province: "Penama",
    status: "Active",
  },
  {
    name: "Ambrym",
    elevation_m: 1334,
    elevation_ft: 4375,
    latitude: -16.25,
    longitude: 168.12,
    location_dms: "16.25°S 168.12°E",
    last_eruption: "ongoing",
    type: "Active Caldera / Lava Lakes (Marum & Benbow)",
    island: "Ambrym",
    province: "Malampa",
    status: "Active (Ongoing)",
  },
  {
    name: "Aneityum",
    elevation_m: 852,
    elevation_ft: 2795,
    latitude: -20.2,
    longitude: 169.83,
    location_dms: "20.20°S 169.83°E",
    last_eruption: "Pleistocene",
    type: "Extinct Stratovolcano",
    island: "Aneityum",
    province: "Tafea",
    status: "Extinct",
  },
  {
    name: "East Epi",
    elevation_m: -34,
    elevation_ft: -111,
    latitude: -16.68,
    longitude: 168.37,
    location_dms: "16.68°S 168.37°E",
    last_eruption: "2004",
    type: "Submarine Volcano",
    island: "Epi Offshore",
    province: "Shefa",
    status: "Submarine Active",
  },
  {
    name: "Eastern Gemini Seamount",
    elevation_m: -80,
    elevation_ft: -262,
    latitude: -20.98,
    longitude: 170.29,
    location_dms: "20.98°S 170.29°E",
    last_eruption: "1996",
    type: "Submarine Seamount",
    island: "Coral Sea",
    province: "Tafea",
    status: "Submarine Active",
  },
  {
    name: "Futuna",
    elevation_m: 666,
    elevation_ft: 2185,
    latitude: -19.32,
    longitude: 170.13,
    location_dms: "19.32°S 170.13°E",
    last_eruption: "Pleistocene",
    type: "Extinct Volcano",
    island: "Futuna",
    province: "Tafea",
    status: "Extinct",
  },
  {
    name: "Gaua",
    elevation_m: 979,
    elevation_ft: 2614,
    latitude: -14.27,
    longitude: 167.5,
    location_dms: "14.27°S 167.50°E",
    last_eruption: "1982",
    type: "Active Stratovolcano (Mt. Gharat)",
    island: "Gaua",
    province: "Torba",
    status: "Active",
  },
  {
    name: "Kutali",
    elevation_m: 833,
    elevation_ft: 2733,
    latitude: -16.73,
    longitude: 168.28,
    location_dms: "16.73°S 168.28°E",
    last_eruption: "Unknown",
    type: "Volcanic Complex",
    island: "Epi",
    province: "Shefa",
    status: "Inactive",
  },
  {
    name: "Kuwae",
    elevation_m: -2,
    elevation_ft: -7,
    latitude: -16.829,
    longitude: 168.536,
    location_dms: "16.829°S 168.536°E",
    last_eruption: "1974",
    type: "Submarine Caldera",
    island: "Epi / Tongoa",
    province: "Shefa",
    status: "Submarine Active",
  },
  {
    name: "Lopevi",
    elevation_m: 1413,
    elevation_ft: 4636,
    latitude: -16.5,
    longitude: 168.34,
    location_dms: "16.50°S 168.34°E",
    last_eruption: "2006",
    type: "Active Stratovolcano",
    island: "Lopevi",
    province: "Malampa",
    status: "Active",
  },
  {
    name: "Makura",
    elevation_m: 644,
    elevation_ft: 2113,
    latitude: -17.0,
    longitude: 168.5,
    location_dms: "17.0°S 168.5°E",
    last_eruption: "Unknown",
    type: "Volcanic Island Rim",
    island: "Makura",
    province: "Shefa",
    status: "Inactive",
  },
  {
    name: "Merelava",
    elevation_m: 883,
    elevation_ft: 3373,
    latitude: -14.45,
    longitude: 168.05,
    location_dms: "14.45°S 168.05°E",
    last_eruption: "1606",
    type: "Dormant Stratovolcano",
    island: "Merelava",
    province: "Torba",
    status: "Dormant",
  },
  {
    name: "Mota Lava",
    elevation_m: 411,
    elevation_ft: 1348,
    latitude: -13.7,
    longitude: 167.65,
    location_dms: "13.7°S 167.65°E",
    last_eruption: "300,000 BC",
    type: "Extinct Stratovolcano",
    island: "Mota Lava",
    province: "Torba",
    status: "Extinct",
  },
  {
    name: "North Vate",
    elevation_m: 594,
    elevation_ft: 1949,
    latitude: -17.45,
    longitude: 168.33,
    location_dms: "17.45°S 168.33°E",
    last_eruption: "Holocene",
    type: "Volcanic Complex",
    island: "Efate",
    province: "Shefa",
    status: "Holocene",
  },
  {
    name: "Traitor's Head",
    elevation_m: 837,
    elevation_ft: 2746,
    latitude: -18.75,
    longitude: 168.33,
    location_dms: "18.75°S 168.33°E",
    last_eruption: "1881",
    type: "Volcanic Complex",
    island: "Erromango",
    province: "Tafea",
    status: "Historical",
  },
  {
    name: "Tavai Ruro",
    elevation_m: 554,
    elevation_ft: 1818,
    latitude: -16.8,
    longitude: 168.43,
    location_dms: "16.80°S 168.43°E",
    last_eruption: "Unknown",
    type: "Volcanic Cone",
    island: "Tongoa",
    province: "Shefa",
    status: "Inactive",
  },
  {
    name: "Unnamed Caldera",
    elevation_m: 521,
    elevation_ft: 1709,
    latitude: -16.992,
    longitude: 168.592,
    location_dms: "16.992°S 168.592°E",
    last_eruption: "Holocene",
    type: "Submarine / Island Caldera",
    island: "Shepherd Islands",
    province: "Shefa",
    status: "Holocene",
  },
  {
    name: "Ureparapara",
    elevation_m: 764,
    elevation_ft: 2507,
    latitude: -13.54,
    longitude: 167.33,
    location_dms: "13.54°S 167.33°E",
    last_eruption: "476,000 BC",
    type: "Extinct Caldera Island",
    island: "Ureparapara",
    province: "Torba",
    status: "Extinct",
  },
  {
    name: "Vanua Lava",
    elevation_m: 921,
    elevation_ft: 3022,
    latitude: -13.8,
    longitude: 167.47,
    location_dms: "13.80°S 167.47°E",
    last_eruption: "1965",
    type: "Active Stratovolcano (Mt. Suretamatai)",
    island: "Vanua Lava",
    province: "Torba",
    status: "Active",
  },
  {
    name: "Vot Tande",
    elevation_m: 64,
    elevation_ft: 210,
    latitude: -13.25,
    longitude: 167.65,
    location_dms: "13.25°S 167.65°E",
    last_eruption: "4 million years ago",
    type: "Extinct Volcanic Islet",
    island: "Vot Tande",
    province: "Torba",
    status: "Extinct",
  },
  {
    name: "Western Gemini Seamount",
    elevation_m: -30,
    elevation_ft: -98,
    latitude: -21.0,
    longitude: 170.05,
    location_dms: "21.0°S 170.05°E",
    last_eruption: "Unknown",
    type: "Submarine Seamount",
    island: "Coral Sea",
    province: "Tafea",
    status: "Submarine",
  },
  {
    name: "Yasur",
    elevation_m: 405,
    elevation_ft: 1329,
    latitude: -19.52,
    longitude: 169.42,
    location_dms: "19.52°S 169.42°E",
    last_eruption: "ongoing",
    type: "Active Cinder Cone (Mt. Yasur)",
    island: "Tanna",
    province: "Tafea",
    status: "Active (Ongoing)",
  },
];

interface VolcanoesDataTableProps {
  onSelectVolcano?: (coords: { latitude: number; longitude: number }) => void;
}

export default function VolcanoesDataTable({ onSelectVolcano }: VolcanoesDataTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVolcanoes = useMemo(() => {
    return VANUATU_VOLCANOES.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.island.toLowerCase().includes(search.toLowerCase()) ||
        v.location_dms.toLowerCase().includes(search.toLowerCase()) ||
        v.last_eruption.toLowerCase().includes(search.toLowerCase()) ||
        v.type.toLowerCase().includes(search.toLowerCase());

      if (statusFilter === "all") return matchesSearch;
      if (statusFilter === "active")
        return matchesSearch && v.status.toLowerCase().includes("active");
      if (statusFilter === "submarine")
        return matchesSearch && (v.elevation_m < 0 || v.status.toLowerCase().includes("submarine"));
      if (statusFilter === "extinct")
        return matchesSearch && (v.status.toLowerCase().includes("extinct") || v.last_eruption.includes("BC") || v.last_eruption.includes("Pleistocene") || v.last_eruption.includes("million"));
      if (statusFilter === "historical")
        return matchesSearch && !v.status.toLowerCase().includes("active") && !v.status.toLowerCase().includes("extinct");

      return matchesSearch;
    });
  }, [search, statusFilter]);

  const activeCount = VANUATU_VOLCANOES.filter((v) => v.status.toLowerCase().includes("active")).length;
  const submarineCount = VANUATU_VOLCANOES.filter((v) => v.elevation_m < 0).length;
  const highestVolcano = VANUATU_VOLCANOES.reduce((max, v) => (v.elevation_m > max.elevation_m ? v : max), VANUATU_VOLCANOES[0]);

  const handleDownloadFormat = (format: "csv" | "geojson" | "kml" | "json") => {
    const fileUrls: Record<string, string> = {
      csv: "/data/hazards/vut_volcanoes.csv",
      geojson: "/data/hazards/vut_volcanoes.geojson",
      kml: "/data/hazards/vut_volcanoes.kml",
      json: "/data/hazards/vut_volcanoes.json",
    };

    const link = document.createElement("a");
    link.href = fileUrls[format];
    link.download = `vut_volcanoes.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string, elevation: number) => {
    if (status.toLowerCase().includes("ongoing")) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-600/15 text-red-700 border border-red-500/30 rounded-full inline-flex items-center gap-1 animate-pulse">
          <Flame className="w-3 h-3 text-red-600" />
          Active (Ongoing)
        </span>
      );
    }
    if (status.toLowerCase().includes("active")) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-500/15 text-orange-700 border border-orange-500/30 rounded-full inline-flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-600" />
          Active
        </span>
      );
    }
    if (elevation < 0) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/15 text-cyan-700 border border-cyan-500/30 rounded-full inline-flex items-center gap-1">
          <Waves className="w-3 h-3 text-cyan-600" />
          Submarine
        </span>
      );
    }
    if (status.toLowerCase().includes("extinct") || status.toLowerCase().includes("pleistocene")) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-500/15 text-slate-700 border border-slate-400/30 rounded-full inline-flex items-center gap-1">
          <Mountain className="w-3 h-3 text-slate-500" />
          Extinct
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30 rounded-full inline-flex items-center gap-1">
        <Mountain className="w-3 h-3 text-amber-600" />
        {status}
      </span>
    );
  };

  return (
    <div className="bg-transparent sm:bg-card text-card-foreground sm:rounded-2xl p-0 sm:p-6 md:p-8 border-0 sm:border border-border space-y-6">
      {/* Header section */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-600/10 text-red-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
              Vanuatu Volcanoes Spatial Catalog
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Comprehensive inventory of 22 active, dormant, submarine, and extinct volcanoes with OpenStreetMap coordinates
            </p>
          </div>
        </div>

        {/* Download Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground mr-1 hidden sm:inline">
            Download Coordinates:
          </span>
          <button
            onClick={() => handleDownloadFormat("csv")}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleDownloadFormat("geojson")}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download GeoJSON Spatial File"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GeoJSON</span>
          </button>
          <button
            onClick={() => handleDownloadFormat("kml")}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download KML (Google Earth)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>KML</span>
          </button>
          <button
            onClick={() => handleDownloadFormat("json")}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download Raw JSON"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-muted/40 rounded-xl border border-border/80 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
            Total Mapped Volcanoes
          </span>
          <div className="text-2xl font-black text-foreground mt-1">22</div>
          <span className="text-[10px] text-muted-foreground mt-1">All mapped on OpenStreetMap</span>
        </div>

        <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-red-600 tracking-wider">
            Active Volcanic Systems
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">{activeCount}</div>
          <span className="text-[10px] text-red-700/80 mt-1">Including Yasur & Ambrym</span>
        </div>

        <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-cyan-600 tracking-wider">
            Submarine / Seamounts
          </span>
          <div className="text-2xl font-black text-cyan-600 mt-1">{submarineCount}</div>
          <span className="text-[10px] text-cyan-700/80 mt-1">Below sea level elevation</span>
        </div>

        <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider">
            Highest Peak Elevation
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {highestVolcano.elevation_m.toLocaleString()}m
          </div>
          <span className="text-[10px] text-emerald-700/80 mt-1">{highestVolcano.name} ({highestVolcano.elevation_ft.toLocaleString()} ft)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-muted/20 p-3 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search volcano name, island, eruption year, or coordinates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-background"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All (22)" },
              { id: "active", label: "Active" },
              { id: "submarine", label: "Submarine" },
              { id: "historical", label: "Historical" },
              { id: "extinct", label: "Extinct" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setStatusFilter(btn.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  statusFilter === btn.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-border"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 text-muted-foreground font-extrabold uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Volcano Name</th>
                <th className="py-3 px-4">Elevation (Metres)</th>
                <th className="py-3 px-4">Elevation (Feet)</th>
                <th className="py-3 px-4">Coordinates (Location)</th>
                <th className="py-3 px-4">Last Eruption</th>
                <th className="py-3 px-4">Status / Type</th>
                <th className="py-3 px-4 text-right">Actions & OpenStreetMap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredVolcanoes.length > 0 ? (
                filteredVolcanoes.map((v) => {
                  const osmUrl = `https://www.openstreetmap.org/?mlat=${v.latitude}&mlon=${v.longitude}#map=13/${v.latitude}/${v.longitude}`;
                  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${v.latitude},${v.longitude}`;

                  return (
                    <tr
                      key={v.name}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => {
                        if (onSelectVolcano) {
                          onSelectVolcano({ latitude: v.latitude, longitude: v.longitude });
                        }
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{v.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {v.island} Island ({v.province} Province)
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {v.elevation_m < 0 ? (
                          <span className="text-cyan-600">{v.elevation_m} m (Submarine)</span>
                        ) : (
                          <span>{v.elevation_m.toLocaleString()} m</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {v.elevation_ft < 0 ? (
                          <span className="text-cyan-600">{v.elevation_ft} ft</span>
                        ) : (
                          <span>{v.elevation_ft.toLocaleString()} ft</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {v.location_dms}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {v.latitude.toFixed(3)}°, {v.longitude.toFixed(3)}°
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold">
                        {v.last_eruption.toLowerCase() === "ongoing" ? (
                          <span className="text-red-600 font-extrabold flex items-center gap-1">
                            <Flame className="w-3 h-3 animate-pulse" />
                            Ongoing Eruption
                          </span>
                        ) : (
                          <span className="text-foreground">{v.last_eruption}</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(v.status, v.elevation_m)}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {/* Locate on GIS Map Button */}
                          {onSelectVolcano && (
                            <button
                              onClick={() => onSelectVolcano({ latitude: v.latitude, longitude: v.longitude })}
                              className="px-2.5 py-1 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              title="Focus Map on OpenStreetMap View"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>Focus Map</span>
                            </button>
                          )}

                          {/* OpenStreetMap Direct Link */}
                          <a
                            href={osmUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-[11px] font-bold bg-muted hover:bg-primary hover:text-white text-foreground rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            title="Open directly on OpenStreetMap.org"
                          >
                            <Globe className="w-3 h-3" />
                            <span>OSM</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          {/* Google Maps Link */}
                          <a
                            href={gmapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-[11px] font-bold bg-muted hover:bg-blue-600 hover:text-white text-foreground rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            title="Open on Google Maps"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                    No volcanoes found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-muted/40 px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div>
            Showing <span className="font-bold text-foreground">{filteredVolcanoes.length}</span> of 22 mapped volcanoes in Vanuatu
          </div>
          <div>
            Coordinates indexed in WGS 84 (EPSG:4326) Decimal & DMS
          </div>
        </div>
      </div>
    </div>
  );
}
