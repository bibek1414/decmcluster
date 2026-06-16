"use client";

import React, { useState, useMemo } from "react";
import { 
  List, 
  Tent, 
  Footprints, 
  Home, 
  Droplet, 
  Shield, 
  Heart, 
  Truck,
  Users,
  MapPin,
  Baby,
  Accessibility,
  Handshake,
  Activity,
  Search,
  Filter,
  Info
} from "lucide-react";

export default function DashboardSection() {
  const [activeMenu, setActiveMenu] = useState("Summary");
  const [ecSearch, setEcSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Side Menu Options
  const sideMenuItems = [
    { id: "Summary", label: "Summary", icon: List },
    { id: "Evacuation Centres", label: "Evacuation Centres", icon: Tent },
    { id: "Displacement", label: "Displacement", icon: Footprints },
    { id: "Shelter", label: "Shelter", icon: Home },
    { id: "WASH", label: "WASH", icon: Droplet },
    { id: "Protection", label: "Protection", icon: Shield },
    { id: "Basic Services", label: "Basic Services", icon: Heart },
    { id: "Response Tracking", label: "Response Tracking", icon: Truck },
  ];

  // Raw Stats data
  const baseStats = [
    { key: "idps", label: "Estimated IDPs", value: "12,450", icon: Users, category: "Displacement" },
    { key: "ecs", label: "Evacuation Centres", value: "86", icon: Tent, category: "Evacuation Centres" },
    { key: "hhs", label: "Affected HHs", value: "2,340", icon: Home, category: "Displacement" },
    { key: "villages", label: "Villages Assessed", value: "42", icon: MapPin, category: "Summary" },
    { key: "shelter", label: "Shelter Needs", value: "1,120", icon: Home, category: "Shelter" },
    { key: "services", label: "Access to Basic Services", value: "64%", icon: Heart, category: "Basic Services" },
    { key: "children", label: "Children Affected", value: "4,980", icon: Baby, category: "Protection" },
    { key: "disabilities", label: "Persons with Disabilities", value: "355", icon: Accessibility, category: "Protection" },
    { key: "partners", label: "Active Partners", value: "28", icon: Handshake, category: "Response Tracking" },
    { key: "coverage", label: "Response Coverage", value: "67%", icon: Activity, category: "Response Tracking" },
  ];

  // Province-based Data for Chart and SVG Map Interaction
  const provinces = [
    { name: "Torba", ecs: 4, idps: 350, barWidth: "20%", color: "bg-blue-400" },
    { name: "Sanma", ecs: 22, idps: 3100, barWidth: "75%", color: "bg-teal-500" },
    { name: "Penama", ecs: 14, idps: 1800, barWidth: "38%", color: "bg-indigo-500" },
    { name: "Malampa", ecs: 12, idps: 1450, barWidth: "50%", color: "bg-amber-500" },
    { name: "Shefa", ecs: 26, idps: 4200, barWidth: "92%", color: "bg-sky-600" },
    { name: "Tafea", ecs: 12, idps: 1550, barWidth: "63%", color: "bg-emerald-500" },
  ];

  // Evacuation Centres list
  const evacuationCentres = [
    { province: "Shefa", site: "Port Vila Area Council Hall", status: "Open", hhs: 220, type: "Community Hall" },
    { province: "Sanma", site: "Luganville Community Centre", status: "Open", hhs: 185, type: "School" },
    { province: "Tafea", site: "Isangel School Compound", status: "Monitoring", hhs: 95, type: "School" },
    { province: "Malampa", site: "Lakatoro Church Hall", status: "Open", hhs: 130, type: "Church" },
    { province: "Penama", site: "Ranwadi College Gymnasium", status: "Closed", hhs: 0, type: "School" },
    { province: "Torba", site: "Sola Provincial Office", status: "Monitoring", hhs: 45, type: "Office" },
  ];

  // Response tracking summary
  const responseTracking = [
    { sector: "Shelter/NFI", partner: "IOM / Partners", coverage: 68, status: "Ongoing" },
    { sector: "WASH", partner: "Cluster Partners", coverage: 54, status: "Critical Need" },
    { sector: "Protection", partner: "DECM Partners", coverage: 46, status: "Underfunded" },
    { sector: "Access to Basic Services", partner: "NDMO / Partners", coverage: 64, status: "Ongoing" },
  ];

  // Filtered EC list based on search & sidebar category & map selected province
  const filteredEvacuationCentres = useMemo(() => {
    return evacuationCentres.filter((ec) => {
      const matchesSearch = ec.site.toLowerCase().includes(ecSearch.toLowerCase()) || 
                            ec.province.toLowerCase().includes(ecSearch.toLowerCase());
      const matchesProvince = selectedProvince ? ec.province === selectedProvince : true;
      return matchesSearch && matchesProvince;
    });
  }, [ecSearch, selectedProvince]);

  return (
    <div className="space-y-6">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 rounded-lg border border-blue-950">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 border border-white/10">
            <Activity className="w-6 h-6 text-blue-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Displacement Tracking Dashboard</h2>
            <p className="text-xs text-blue-200">Interactive operational mapping & statistics for Vanuatu</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-blue-950/40 border border-blue-700/30 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-blue-300" />
          <span>Active View: <strong className="text-white">{activeMenu}</strong></span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Menu (2 cols) */}
        <div className="lg:col-span-3 xl:col-span-2 flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-200 h-fit">
          <h4 className="text-xs font-bold text-slate-400 px-2.5 pb-2 border-b border-slate-100">
            Sectors & Filters
          </h4>
          <div className="flex flex-col gap-1.5 mt-2">
            {sideMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSelectedProvince(null); // Reset province filter on sector change
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-900 text-white shadow-md shadow-blue-900/10" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-300" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area (9 cols) */}
        <div className="lg:col-span-9 xl:col-span-10 space-y-6">
          
          {/* Key Figures Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {baseStats.map((stat, idx) => {
              const Icon = stat.icon;
              const isHighlighted = activeMenu === "Summary" || activeMenu === stat.category;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border flex items-start gap-3.5 bg-white transition-all duration-300 ${
                    isHighlighted 
                      ? "border-blue-200 bg-blue-50/10" 
                      : "border-slate-100 opacity-60 grayscale-[25%] hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isHighlighted ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-800 leading-none">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visuals Box Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* SVG Map of Vanuatu */}
            <div className="bg-[#fdfdfd] rounded-lg border border-[#d5dce8] overflow-hidden flex flex-col justify-between">
              <div className="bg-[#173f8f] text-white px-3.5 py-2 text-[13px] font-bold flex items-center justify-between">
                <span>Location of Evacuation Centres</span>
                {selectedProvince && (
                  <button 
                    onClick={() => setSelectedProvince(null)}
                    className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between h-full space-y-4">
                <p className="text-[11px] text-slate-500">Click a province to filter the sites list</p>
                
                {/* Styled SVG map representation */}
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-4 bg-slate-50/40 rounded-lg border border-slate-100">
                  {/* SVG Archipelago illustration */}
                  <div className="relative w-40 h-64 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 160 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Island shapes group first */}
                      <g>
                        {/* Torba */}
                        <circle 
                          cx="55" cy="30" r="14" 
                          fill={selectedProvince === "Torba" ? "#1e3a8a" : "#cbd5e1"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Torba" ? null : "Torba")} 
                        />
                        
                        {/* Sanma */}
                        <polygon 
                          points="20,70 55,55 65,85 30,100" 
                          fill={selectedProvince === "Sanma" ? "#1e3a8a" : "#94a3b8"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Sanma" ? null : "Sanma")} 
                        />
                        
                        {/* Penama */}
                        <path 
                          d="M 90,65 Q 105,75 100,95 Q 85,90 90,65 Z" 
                          fill={selectedProvince === "Penama" ? "#1e3a8a" : "#cbd5e1"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Penama" ? null : "Penama")} 
                        />

                        {/* Malampa */}
                        <polygon 
                          points="50,110 75,100 85,130 55,140" 
                          fill={selectedProvince === "Malampa" ? "#1e3a8a" : "#cbd5e1"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Malampa" ? null : "Malampa")} 
                        />

                        {/* Shefa */}
                        <path 
                          d="M 95,160 Q 120,165 110,185 Q 90,180 95,160 Z" 
                          fill={selectedProvince === "Shefa" ? "#1e3a8a" : "#94a3b8"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Shefa" ? null : "Shefa")} 
                        />

                        {/* Tafea */}
                        <polygon 
                          points="120,210 145,225 130,250 110,230" 
                          fill={selectedProvince === "Tafea" ? "#1e3a8a" : "#cbd5e1"} 
                          className="cursor-pointer transition-all duration-300 hover:fill-blue-500"
                          onClick={() => setSelectedProvince(selectedProvince === "Tafea" ? null : "Tafea")} 
                        />
                      </g>

                      {/* Labels group drawn on top, click-through */}
                      <g className="pointer-events-none select-none">
                        {/* Torba Text */}
                        <text x="75" y="34" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Torba" ? "fill-blue-900" : "fill-slate-600"}`}>Torba</text>
                        
                        {/* Sanma Text - moved left to x=15 to avoid Penama overlap */}
                        <text x="15" y="82" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Sanma" ? "fill-blue-900" : "fill-slate-600"}`}>Sanma</text>
                        
                        {/* Penama Text */}
                        <text x="110" y="82" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Penama" ? "fill-blue-900" : "fill-slate-600"}`}>Penama</text>

                        {/* Malampa Text */}
                        <text x="95" y="125" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Malampa" ? "fill-blue-900" : "fill-slate-600"}`}>Malampa</text>

                        {/* Shefa Text */}
                        <text x="120" y="177" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Shefa" ? "fill-blue-900" : "fill-slate-600"}`}>Shefa</text>

                        {/* Tafea Text */}
                        <text x="80" y="235" className={`text-[10px] font-extrabold transition-colors ${selectedProvince === "Tafea" ? "fill-blue-900" : "fill-slate-600"}`}>Tafea</text>
                      </g>
                    </svg>
                  </div>

                  {/* Map stats legend */}
                  <div className="space-y-3.5 w-full">
                    <h4 className="text-[11px] font-bold text-slate-400">
                      Provinces & Active Sites
                    </h4>
                    <div className="space-y-2">
                      {provinces.map((prov) => (
                        <button
                          key={prov.name}
                          onClick={() => setSelectedProvince(selectedProvince === prov.name ? null : prov.name)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                            selectedProvince === prov.name 
                              ? "bg-blue-50 border-blue-200 font-bold text-blue-900" 
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${prov.color}`}></span>
                            <span>{prov.name} Province</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              {prov.ecs} ECs
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {prov.idps.toLocaleString()} IDPs
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Summary by Province Chart */}
            <div className="bg-[#fdfdfd] rounded-lg border border-[#d5dce8] overflow-hidden flex flex-col justify-between">
              <div className="bg-[#173f8f] text-white px-3.5 py-2 text-[13px] font-bold">
                Sector Summary by Province
              </div>
              
              <div className="p-4 flex flex-col justify-between h-full space-y-4">
                <p className="text-[11px] text-slate-500">Estimated needs fulfillment & status mapping</p>

              <div className="space-y-4 py-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Shefa — Shelter / WASH / Protection</span>
                    <span className="text-blue-600">92%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: "92%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Sanma — Shelter / Basic Services</span>
                    <span className="text-blue-600">75%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Tafea — Evacuation Centre Support</span>
                    <span className="text-blue-600">63%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: "63%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Malampa — Service Mapping</span>
                    <span className="text-blue-600">50%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: "50%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Penama — Response Tracking</span>
                    <span className="text-blue-600">38%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: "38%" }}></div>
                  </div>
                </div>
              </div>

                <div className="text-[10px] text-slate-400 leading-relaxed pt-3 border-t border-slate-100 mt-4">
                  <span>Ratios represent completed assessments and mapped responses per province.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Historical Events Snapshot */}
          <div className="bg-[#fdfdfd] rounded-lg border border-[#d5dce8] overflow-hidden">
            <div className="bg-[#173f8f] text-white px-3.5 py-2 text-[13px] font-bold">
              Historical Events Snapshot
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-[11px] text-slate-500">Major historic displace events tracked in database</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { year: "2015", event: "TC Pam", impact: "High Impact", color: "bg-red-50 text-red-700 border-red-100" },
                  { year: "2017", event: "Ambae Volcano", impact: "Displacement", color: "bg-amber-50 text-amber-700 border-amber-100" },
                  { year: "2020", event: "TC Harold", impact: "Severe Impact", color: "bg-rose-50 text-rose-700 border-rose-100" },
                  { year: "2023", event: "TC Judy/Kevin", impact: "Multi-island", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                  { year: "2024", event: "Earthquake", impact: "Urban Impact", color: "bg-blue-50 text-blue-700 border-blue-100" }
                ].map((evt, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border text-center flex flex-col justify-center gap-1 ${evt.color}`}>
                    <span className="text-sm font-extrabold tracking-tight">{evt.year}</span>
                    <span className="text-xs font-bold">{evt.event}</span>
                    <span className="text-[9px] font-semibold opacity-90">{evt.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Data Tables Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Evacuation Centres List Table */}
            <div className="bg-[#fdfdfd] rounded-lg border border-[#d5dce8] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-[#173f8f] text-white px-3.5 py-2 text-[13px] font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d5dce8]">
                  <div>
                    <span>Evacuation Centre List / Sites</span>
                    {selectedProvince && (
                      <span className="text-[10px] text-blue-200 ml-2 font-normal">
                        ({selectedProvince})
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      type="text"
                      placeholder="Search site..."
                      value={ecSearch}
                      onChange={(e) => setEcSearch(e.target.value)}
                      className="bg-white/10 text-white placeholder-white/50 text-xs px-2.5 pl-8 py-1 rounded-md border border-white/20 focus:outline-none focus:border-white/50 w-full sm:w-40"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="p-3 font-semibold">Province</th>
                        <th className="p-3 font-semibold">Site Name</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 text-right font-semibold">HHs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredEvacuationCentres.length > 0 ? (
                        filteredEvacuationCentres.map((ec, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-semibold text-slate-900">{ec.province}</td>
                            <td className="p-3">{ec.site}</td>
                            <td className="p-3 text-slate-500 text-[10px] font-bold">{ec.type}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                ec.status === "Open" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                  : ec.status === "Monitoring" 
                                    ? "bg-amber-50 text-amber-700 border-amber-100" 
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}>
                                {ec.status}
                              </span>
                            </td>
                            <td className="p-3 text-right font-extrabold">{ec.hhs}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No evacuation centres found matching filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Showing {filteredEvacuationCentres.length} centers</span>
                <span className="font-bold">Total HHs: {filteredEvacuationCentres.reduce((acc, curr) => acc + curr.hhs, 0)}</span>
              </div>
            </div>

            {/* Response Tracking Table */}
            <div className="bg-[#fdfdfd] rounded-lg border border-[#d5dce8] overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-[#173f8f] text-white px-3.5 py-2 text-[13px] font-bold border-b border-[#d5dce8]">
                  Response Tracking Summary
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="p-3 font-semibold">Sector</th>
                        <th className="p-3 font-semibold">Partner</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 text-right font-semibold">Coverage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {responseTracking.map((res, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">{res.sector}</td>
                          <td className="p-3 text-slate-500">{res.partner}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              res.status === "Ongoing" 
                                ? "bg-blue-50 text-blue-700 border-blue-100" 
                                : res.status === "Critical Need" 
                                  ? "bg-rose-50 text-rose-700 border-rose-100 font-extrabold" 
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-3 text-right font-extrabold">
                            <div className="flex items-center justify-end gap-2">
                              <span>{res.coverage}%</span>
                              <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${res.coverage}%` }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Sector targets updated in database: 2 hours ago.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
