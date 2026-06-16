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

import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

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
    { name: "Torba", ecs: 4, idps: 350, barWidth: "20%", color: "text-blue-500 bg-blue-500" },
    { name: "Sanma", ecs: 22, idps: 3100, barWidth: "75%", color: "text-teal-500 bg-teal-500" },
    { name: "Penama", ecs: 14, idps: 1800, barWidth: "38%", color: "text-indigo-500 bg-indigo-500" },
    { name: "Malampa", ecs: 12, idps: 1450, barWidth: "50%", color: "text-amber-500 bg-amber-500" },
    { name: "Shefa", ecs: 26, idps: 4200, barWidth: "92%", color: "text-sky-500 bg-sky-500" },
    { name: "Tafea", ecs: 12, idps: 1550, barWidth: "63%", color: "text-emerald-500 bg-emerald-500" },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-primary text-primary-foreground px-6 py-4 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
            <Activity className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Displacement Tracking Dashboard</h2>
            <p className="text-xs text-primary-foreground/80">Interactive operational mapping & statistics for Vanuatu</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-primary-foreground/90" />
          <span>Active View: <strong className="text-primary-foreground">{activeMenu}</strong></span>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side Menu (2 cols) */}
        <div className="lg:col-span-3 xl:col-span-2 flex flex-col gap-2 bg-card text-card-foreground p-4 rounded-lg border border-border h-fit">
          <h4 className="text-xs font-bold text-muted-foreground px-2.5 pb-2 border-b border-border">
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
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground/60"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground"></div>}
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
                  className={`p-4 rounded-lg border flex items-start gap-3.5 bg-card text-card-foreground transition-all duration-300 ${
                    isHighlighted 
                      ? "border-primary/40 bg-primary/5" 
                      : "border-border opacity-60 grayscale-[25%] hover:opacity-100 hover:grayscale-0"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${isHighlighted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground leading-none">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] font-bold text-muted-foreground mt-1 leading-tight">
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
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden flex flex-col justify-between">
              <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold flex items-center justify-between">
                <span>Location of Evacuation Centres</span>
                {selectedProvince && (
                  <button 
                    onClick={() => setSelectedProvince(null)}
                    className="text-[10px] bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="p-4 flex flex-col justify-between h-full space-y-4">
                <p className="text-[11px] text-muted-foreground">Click a province to filter the sites list</p>
                
                {/* Styled SVG map representation */}
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-4 bg-muted/40 rounded-lg border border-border">
                  {/* SVG Archipelago illustration */}
                  <div className="relative w-40 h-64 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 160 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Island shapes group first */}
                      <g>
                        {/* Torba */}
                        <circle 
                          cx="55" cy="30" r="14" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Torba" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Torba" ? null : "Torba")} 
                        />
                        
                        {/* Sanma */}
                        <polygon 
                          points="20,70 55,55 65,85 30,100" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Sanma" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Sanma" ? null : "Sanma")} 
                        />
                        
                        {/* Penama */}
                        <path 
                          d="M 90,65 Q 105,75 100,95 Q 85,90 90,65 Z" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Penama" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Penama" ? null : "Penama")} 
                        />

                        {/* Malampa */}
                        <polygon 
                          points="50,110 75,100 85,130 55,140" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Malampa" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Malampa" ? null : "Malampa")} 
                        />

                        {/* Shefa */}
                        <path 
                          d="M 95,160 Q 120,165 110,185 Q 90,180 95,160 Z" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Shefa" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Shefa" ? null : "Shefa")} 
                        />

                        {/* Tafea */}
                        <polygon 
                          points="120,210 145,225 130,250 110,230" 
                          className={`cursor-pointer transition-colors duration-300 hover:text-primary/80 ${
                            selectedProvince === "Tafea" ? "text-primary" : "text-muted-foreground/35"
                          }`}
                          fill="currentColor"
                          onClick={() => setSelectedProvince(selectedProvince === "Tafea" ? null : "Tafea")} 
                        />
                      </g>

                      {/* Labels group drawn on top, click-through */}
                      <g className="pointer-events-none select-none">
                        {/* Torba Text */}
                        <text x="75" y="34" className={`text-[10px] font-extrabold fill-foreground/80`}>Torba</text>
                        
                        {/* Sanma Text */}
                        <text x="15" y="82" className={`text-[10px] font-extrabold fill-foreground/80`}>Sanma</text>
                        
                        {/* Penama Text */}
                        <text x="110" y="82" className={`text-[10px] font-extrabold fill-foreground/80`}>Penama</text>

                        {/* Malampa Text */}
                        <text x="95" y="125" className={`text-[10px] font-extrabold fill-foreground/80`}>Malampa</text>

                        {/* Shefa Text */}
                        <text x="120" y="177" className={`text-[10px] font-extrabold fill-foreground/80`}>Shefa</text>

                        {/* Tafea Text */}
                        <text x="80" y="235" className={`text-[10px] font-extrabold fill-foreground/80`}>Tafea</text>
                      </g>
                    </svg>
                  </div>

                  {/* Map stats legend */}
                  <div className="space-y-3.5 w-full">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Provinces & Active Sites
                    </h4>
                    <div className="space-y-2">
                      {provinces.map((prov) => (
                        <button
                          key={prov.name}
                          onClick={() => setSelectedProvince(selectedProvince === prov.name ? null : prov.name)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                            selectedProvince === prov.name 
                              ? "bg-primary/10 border-primary/40 font-bold text-primary" 
                              : "bg-card hover:bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${prov.color.split(" ")[1]}`}></span>
                            <span>{prov.name} Province</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-muted text-foreground px-1.5 py-0.5 rounded text-[10px] font-bold border border-border">
                              {prov.ecs} ECs
                            </span>
                            <span className="text-muted-foreground text-[10px]">
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
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden flex flex-col justify-between">
              <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold">
                Sector Summary by Province
              </div>
              
              <div className="p-4 flex flex-col justify-between h-full space-y-4">
                <p className="text-[11px] text-muted-foreground">Estimated needs fulfillment & status mapping</p>

                <div className="space-y-4 py-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>Shefa — Shelter / WASH / Protection</span>
                      <span className="text-primary font-bold">92%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>Sanma — Shelter / Basic Services</span>
                      <span className="text-primary font-bold">75%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>Tafea — Evacuation Centre Support</span>
                      <span className="text-primary font-bold">63%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "63%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>Malampa — Service Mapping</span>
                      <span className="text-primary font-bold">50%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "50%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                      <span>Penama — Response Tracking</span>
                      <span className="text-primary font-bold">38%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground leading-relaxed pt-3 border-t border-border mt-4">
                  <span>Ratios represent completed assessments and mapped responses per province.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Historical Events Snapshot */}
          <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
            <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold">
              Historical Events Snapshot
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-[11px] text-muted-foreground">Major historic displace events tracked in database</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { year: "2015", event: "TC Pam", impact: "High Impact", color: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30" },
                  { year: "2017", event: "Ambae Volcano", impact: "Displacement", color: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30" },
                  { year: "2020", event: "TC Harold", impact: "Severe Impact", color: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30" },
                  { year: "2023", event: "TC Judy/Kevin", impact: "Multi-island", color: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30" },
                  { year: "2024", event: "Earthquake", impact: "Urban Impact", color: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30" }
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
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span>Evacuation Centre List</span>
                    {selectedProvince && (
                      <span className="text-[10px] text-primary-foreground/80 font-normal">
                        ({selectedProvince})
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-primary-foreground/60" />
                    <input 
                      type="text"
                      placeholder="Search site..."
                      value={ecSearch}
                      onChange={(e) => setEcSearch(e.target.value)}
                      className="bg-primary-foreground/15 text-primary-foreground placeholder-primary-foreground/50 text-xs px-2.5 pl-8 py-1 rounded-md border border-primary-foreground/25 focus:outline-none focus:border-primary-foreground/50 w-full sm:w-40"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="font-bold h-9">Province</TableHead>
                      <TableHead className="font-bold h-9">Site Name</TableHead>
                      <TableHead className="font-bold h-9">Type</TableHead>
                      <TableHead className="font-bold h-9">Status</TableHead>
                      <TableHead className="font-bold text-right h-9">HHs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {filteredEvacuationCentres.length > 0 ? (
                      filteredEvacuationCentres.map((ec, idx) => (
                        <TableRow key={idx} className="border-border">
                          <TableCell className="font-bold text-foreground">{ec.province}</TableCell>
                          <TableCell>{ec.site}</TableCell>
                          <TableCell className="text-muted-foreground font-semibold">{ec.type}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              ec.status === "Open" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" 
                                : ec.status === "Monitoring" 
                                  ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30" 
                                  : "bg-muted text-muted-foreground border-border"
                            }`}>
                              {ec.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-foreground">{ec.hhs}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="p-6 text-center text-muted-foreground">
                          No evacuation centres found matching filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="p-3 bg-muted/50 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Showing {filteredEvacuationCentres.length} centers</span>
                <span className="font-bold">Total HHs: {filteredEvacuationCentres.reduce((acc, curr) => acc + curr.hhs, 0)}</span>
              </div>
            </div>

            {/* Response Tracking Table */}
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold border-b border-border">
                  Response Tracking Summary
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="font-bold h-9">Sector</TableHead>
                      <TableHead className="font-bold h-9">Partner</TableHead>
                      <TableHead className="font-bold h-9">Status</TableHead>
                      <TableHead className="font-bold text-right h-9">Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[11px]">
                    {responseTracking.map((res, idx) => (
                      <TableRow key={idx} className="border-border">
                        <TableCell className="font-bold text-foreground">{res.sector}</TableCell>
                        <TableCell className="text-muted-foreground">{res.partner}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            res.status === "Ongoing" 
                              ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30" 
                              : res.status === "Critical Need" 
                                ? "bg-rose-50 text-rose-700 border-rose-100 font-extrabold dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30" 
                                : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                          }`}>
                            {res.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-extrabold text-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <span>{res.coverage}%</span>
                            <div className="w-12 bg-muted h-2 rounded-full overflow-hidden hidden sm:block">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${res.coverage}%` }}></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-3 bg-muted/50 border-t border-border text-[11px] text-muted-foreground flex items-center gap-1">
                <Filter className="w-3 h-3 text-muted-foreground/60" />
                <span>Sector targets updated in database: 2 hours ago.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
