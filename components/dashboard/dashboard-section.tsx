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

import {
  useDashboardSummary,
  useEvacuationCentreLocationSummary,
  useProvinceSectorSummary,
  useHistoricalEvents,
  useEvacuationCentres,
  useResponseTrackingSummary,
  useEvacuationCentresStats
} from "@/hooks/use-dashboard";
import { useDebounce } from "@/hooks/use-debounce";

export default function DashboardSection() {
  const [activeMenu, setActiveMenu] = useState("Summary");
  const [ecSearch, setEcSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const debouncedSearch = useDebounce(ecSearch, 300);

  // TanStack React Query Hooks
  const { data: summaryData, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: locationSummaryData, isLoading: isLocationLoading } = useEvacuationCentreLocationSummary();
  const { data: sectorSummaryData, isLoading: isSectorSummaryLoading } = useProvinceSectorSummary();
  const { data: historicalEventsData, isLoading: isEventsLoading } = useHistoricalEvents();
  const { data: centresData, isLoading: isCentresLoading } = useEvacuationCentres(debouncedSearch);
  const { data: trackingData, isLoading: isTrackingLoading } = useResponseTrackingSummary();
  const { data: ecStatsData, isLoading: isEcStatsLoading } = useEvacuationCentresStats();

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

  // Dynamic Key Figures Stats data
  const baseStats = useMemo(() => {
    const defaultStats = {
      estimated_idp: 12450,
      evacuation_centres: 86,
      affected_hhs: 2340,
      villages_assessed: 42,
      shelter_needs: 1120,
      access_to_basic_services: 64,
      children_affected: 4980,
      person_with_disabilities: 355,
      active_partners: 28,
      response_coverage: 67
    };
    const s = summaryData?.[0] || defaultStats;

    return [
      { key: "idps", label: "Estimated IDPs", value: s.estimated_idp.toLocaleString(), icon: Users, category: "Displacement" },
      { key: "ecs", label: "Evacuation Centres", value: s.evacuation_centres.toLocaleString(), icon: Tent, category: "Evacuation Centres" },
      { key: "hhs", label: "Affected HHs", value: s.affected_hhs.toLocaleString(), icon: Home, category: "Displacement" },
      { key: "villages", label: "Villages Assessed", value: s.villages_assessed.toLocaleString(), icon: MapPin, category: "Summary" },
      { key: "shelter", label: "Shelter Needs", value: s.shelter_needs.toLocaleString(), icon: Home, category: "Shelter" },
      { key: "services", label: "Access to Basic Services", value: `${s.access_to_basic_services}%`, icon: Heart, category: "Basic Services" },
      { key: "children", label: "Children Affected", value: s.children_affected.toLocaleString(), icon: Baby, category: "Protection" },
      { key: "disabilities", label: "Persons with Disabilities", value: s.person_with_disabilities.toLocaleString(), icon: Accessibility, category: "Protection" },
      { key: "partners", label: "Active Partners", value: s.active_partners.toLocaleString(), icon: Handshake, category: "Response Tracking" },
      { key: "coverage", label: "Response Coverage", value: `${s.response_coverage}%`, icon: Activity, category: "Response Tracking" },
    ];
  }, [summaryData]);

  // Evacuation Centres Stats
  const ecStats = useMemo(() => {
    const defaultEcStats = {
      total_ec: 612,
      total_internal_capacity: 19460,
      total_toilets: 277,
      total_water_storage: 5223887,
      total_showers: 116,
      is_govt_approved: 85,
      first_aid_kit_available: 75,
      first_aid_trained_person: 209
    };
    const s = ecStatsData || defaultEcStats;

    return [
      { key: "total_ec", label: "Total Evacuation Centres", value: s.total_ec.toLocaleString(), icon: Tent },
      { key: "capacity", label: "Total Capacity", value: s.total_internal_capacity.toLocaleString(), icon: Users },
      { key: "toilets", label: "Total Toilets", value: s.total_toilets.toLocaleString(), icon: Droplet },
      { key: "showers", label: "Total Showers", value: s.total_showers.toLocaleString(), icon: Droplet },
      { key: "water", label: "Total Water Storage", value: `${s.total_water_storage.toLocaleString()} L`, icon: Droplet },
      { key: "govt_approved", label: "Govt Approved Status", value: s.is_govt_approved.toLocaleString(), icon: Shield },
      { key: "first_aid_kit", label: "First Aid Kit Available", value: s.first_aid_kit_available.toLocaleString(), icon: Heart },
      { key: "first_aid_person", label: "First Aid Trained Person", value: s.first_aid_trained_person.toLocaleString(), icon: Activity },
    ];
  }, [ecStatsData]);

  // WASH Facilities list
  const washFacilitiesList = useMemo(() => {
    const defaultFacilities = {
      toilets: 277,
      showers: 116,
      kitchen_facilities: 50,
      laundry_facilities: 24,
    };
    const f = ecStatsData?.wash_and_facilities || defaultFacilities;
    const items = [
      { name: "Toilets", value: f.toilets },
      { name: "Showers", value: f.showers },
      { name: "Kitchen Facilities", value: f.kitchen_facilities },
      { name: "Laundry Facilities", value: f.laundry_facilities },
    ];
    const maxVal = Math.max(...items.map(i => i.value), 1);
    return items.map(item => ({
      ...item,
      percentage: Math.round((item.value / maxVal) * 100),
    }));
  }, [ecStatsData]);

  // Province-based Data for Chart and SVG Map Interaction
  const provinces = useMemo(() => {
    const defaultProvinces = [
      { name: "Torba", ecs: 4, idps: 350, color: "text-blue-500 bg-blue-500" },
      { name: "Sanma", ecs: 22, idps: 3100, color: "text-teal-500 bg-teal-500" },
      { name: "Penama", ecs: 14, idps: 1800, color: "text-indigo-500 bg-indigo-500" },
      { name: "Malampa", ecs: 12, idps: 1450, color: "text-amber-500 bg-amber-500" },
      { name: "Shefa", ecs: 26, idps: 4200, color: "text-sky-500 bg-sky-500" },
      { name: "Tafea", ecs: 12, idps: 1550, color: "text-emerald-500 bg-emerald-500" },
    ];

    const colorMap: Record<string, string> = {
      Torba: "text-blue-500 bg-blue-500",
      Sanma: "text-teal-500 bg-teal-500",
      Penama: "text-indigo-500 bg-indigo-500",
      Malampa: "text-amber-500 bg-amber-500",
      Malma: "text-amber-500 bg-amber-500",
      Shefa: "text-sky-500 bg-sky-500",
      Tafea: "text-emerald-500 bg-emerald-500",
    };

    if (activeMenu === "Evacuation Centres") {
      if (!ecStatsData || !ecStatsData.evacutation_center) {
        return defaultProvinces;
      }
      
      const provinceNames = ["Torba", "Sanma", "Penama", "Malampa", "Shefa", "Tafea"];
      const apiMap = new Map(
        ecStatsData.evacutation_center.map((item) => {
          const cleanName = item.province.replace(" Province", "").trim();
          const finalName = cleanName === "Malma" ? "Malampa" : cleanName;
          return [finalName, item];
        })
      );

      return provinceNames.map((name) => {
        const item = apiMap.get(name);
        return {
          name,
          ecs: item ? item.total_ec : 0,
          idps: item ? item.idp : 0,
          color: colorMap[name] || "text-gray-500 bg-gray-500",
        };
      });
    }

    if (!locationSummaryData || locationSummaryData.length === 0) {
      return defaultProvinces;
    }

    // Sort by order or map directly
    const sorted = [...locationSummaryData].sort((a, b) => a.order - b.order);

    return sorted.map((item) => {
      const cleanName = item.province.replace(" Province", "");
      const finalName = cleanName === "Malma" ? "Malampa" : cleanName;
      return {
        name: finalName,
        ecs: item.ecs,
        idps: item.idps,
        color: colorMap[finalName] || "text-gray-500 bg-gray-500",
      };
    });
  }, [locationSummaryData, activeMenu, ecStatsData]);

  // Sector summary mapping
  const sectorSummary = useMemo(() => {
    const defaultSummary = [
      { id: 1, title: "Shefa — Shelter / WASH / Protection", percentage: 92.0 },
      { id: 2, title: "Sanma — Shelter / Basic Services", percentage: 75.0 },
      { id: 4, title: "Tafea — Evacuation Centre Support", percentage: 63.0 },
      { id: 5, title: "Malampa — Service Mapping", percentage: 50.0 },
      { id: 6, title: "Penama — Response Tracking", percentage: 38.0 },
    ];
    return sectorSummaryData || defaultSummary;
  }, [sectorSummaryData]);

  // Historical events mapping
  const historicalEvents = useMemo(() => {
    const defaultEvents = [
      { id: 1, event: "TC Pam", year: 2015, impact: "High Impact" },
      { id: 2, event: "Ambae Volcano", year: 2017, impact: "Displacement" },
      { id: 3, event: "TC Harold", year: 2020, impact: "Severe Impact" },
      { id: 4, event: "TC Judy/Kevin", year: 2023, impact: "Multi-island" },
      { id: 5, event: "Earthquake", year: 2024, impact: "Urban Impact" },
    ];
    return historicalEventsData || defaultEvents;
  }, [historicalEventsData]);

  const eventColors = [
    "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
    "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  ];

  // Evacuation Centres list mapping
  const evacuationCentres = useMemo(() => {
    const defaultCentres = [
      { province: "Shefa", site: "Port Vila Area Council Hall", status: "Open", hhs: 220, type: "Community Hall" },
      { province: "Sanma", site: "Luganville Community Centre", status: "Open", hhs: 185, type: "School" },
      { province: "Tafea", site: "Isangel School Compound", status: "Monitoring", hhs: 95, type: "School" },
      { province: "Malampa", site: "Lakatoro Church Hall", status: "Open", hhs: 130, type: "Church" },
      { province: "Penama", site: "Ranwadi College Gymnasium", status: "Closed", hhs: 0, type: "School" },
      { province: "Torba", site: "Sola Provincial Office", status: "Monitoring", hhs: 45, type: "Office" },
    ];

    if (!centresData) return defaultCentres;

    return centresData.map((item) => ({
      province: item.province,
      site: item.site_name,
      status: item.status,
      hhs: item.hhs,
      type: item.type,
    }));
  }, [centresData]);

  // Response tracking mapping
  const responseTracking = useMemo(() => {
    const defaultTracking = [
      { sector: "Shelter/NFI", partner: "IOM / Partners", coverage: 68, status: "Ongoing" },
      { sector: "WASH", partner: "Cluster Partners", coverage: 54, status: "Critical Need" },
      { sector: "Protection", partner: "DECM Partners", coverage: 46, status: "Underfunded" },
      { sector: "Access to Basic Services", partner: "NDMO / Partners", coverage: 64, status: "Ongoing" },
    ];
    return trackingData || defaultTracking;
  }, [trackingData]);

  // Filtered EC list based on map selected province (search is handled on the backend)
  const filteredEvacuationCentres = useMemo(() => {
    return evacuationCentres.filter((ec) => {
      const matchesProvince = selectedProvince ? ec.province === selectedProvince : true;
      return matchesProvince;
    });
  }, [evacuationCentres, selectedProvince]);

  const isLoading = activeMenu === "Evacuation Centres" ? isEcStatsLoading : isSummaryLoading;
  const currentStats = activeMenu === "Evacuation Centres" ? ecStats : baseStats;

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
          <h4 className="text-xs font-bold text-muted-foreground px-2.5 pb-2 border-b border-border hidden lg:block">
            Sectors & Filters
          </h4>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 scrollbar-thin">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer whitespace-nowrap lg:w-full ${
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
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 animate-fadeIn">
              {Array.from({ length: activeMenu === "Evacuation Centres" ? 8 : 10 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-lg border border-border bg-card text-card-foreground flex items-start gap-3.5 animate-pulse"
                >
                  <div className="p-2.5 rounded-xl bg-muted w-10 h-10 shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-6 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 animate-fadeIn">
              {currentStats.map((stat, idx) => {
                const Icon = stat.icon;
                const isHighlighted = activeMenu === "Evacuation Centres" || activeMenu === "Summary" || (stat.category && activeMenu === stat.category);
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
          )}

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
                        <text x="75" y="34" className="text-[10px] font-extrabold fill-foreground/80">Torba</text>
                        
                        {/* Sanma Text */}
                        <text x="15" y="82" className="text-[10px] font-extrabold fill-foreground/80">Sanma</text>
                        
                        {/* Penama Text */}
                        <text x="110" y="82" className="text-[10px] font-extrabold fill-foreground/80">Penama</text>

                        {/* Malampa Text */}
                        <text x="95" y="125" className="text-[10px] font-extrabold fill-foreground/80">Malampa</text>

                        {/* Shefa Text */}
                        <text x="120" y="177" className="text-[10px] font-extrabold fill-foreground/80">Shefa</text>

                        {/* Tafea Text */}
                        <text x="80" y="235" className="text-[10px] font-extrabold fill-foreground/80">Tafea</text>
                      </g>
                    </svg>
                  </div>

                  {/* Map stats legend */}
                  <div className="space-y-3.5 w-full">
                    <h4 className="text-[11px] font-bold text-muted-foreground">
                      Provinces & Active Sites
                    </h4>
                    {isLocationLoading ? (
                      <div className="space-y-2 w-full animate-fadeIn">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div key={idx} className="h-9 w-full bg-muted/50 rounded-lg animate-pulse border border-border/30" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 animate-fadeIn">
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sector Summary by Province Chart OR WASH & Facilities Summary */}
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden flex flex-col justify-between">
              <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold">
                {activeMenu === "Evacuation Centres" ? "WASH & Facilities Summary" : "Sector Summary by Province"}
              </div>
              
              <div className="p-4 flex flex-col justify-between h-full space-y-4">
                <p className="text-[11px] text-muted-foreground">
                  {activeMenu === "Evacuation Centres" 
                    ? "Facilities counts available across evacuation centres" 
                    : "Estimated needs fulfillment & status mapping"}
                </p>

                {activeMenu === "Evacuation Centres" ? (
                  isLoading ? (
                    <div className="space-y-4 py-2 animate-pulse w-full">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="h-4 bg-muted rounded w-10" />
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 py-2 animate-fadeIn w-full">
                      {washFacilitiesList.map((item, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                            <span>{item.name}</span>
                            <span className="text-primary font-bold">{item.value.toLocaleString()}</span>
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  isSectorSummaryLoading ? (
                    <div className="space-y-4 py-2 animate-pulse w-full">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="h-4 bg-muted rounded w-1/2" />
                            <div className="h-4 bg-muted rounded w-10" />
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 py-2 animate-fadeIn w-full">
                      {sectorSummary.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                            <span>{item.title}</span>
                            <span className="text-primary font-bold">{item.percentage}%</span>
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                <div className="text-[10px] text-muted-foreground leading-relaxed pt-3 border-t border-border mt-4">
                  <span>
                    {activeMenu === "Evacuation Centres"
                      ? "Figures represent total facilities mapped across all active evacuation centres."
                      : "Ratios represent completed assessments and mapped responses per province."}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Historical Events Snapshot */}
          {activeMenu !== "Evacuation Centres" && (
            <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden">
              <div className="bg-primary text-primary-foreground px-3.5 py-2 text-[13px] font-bold">
                Historical Events Snapshot
              </div>
              
              <div className="p-4 space-y-4">
                <p className="text-[11px] text-muted-foreground">Major historic displace events tracked in database</p>
                
                {isEventsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 animate-pulse">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="p-3 h-16 rounded-lg border border-border/30 bg-muted/40" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 animate-fadeIn">
                    {historicalEvents.map((evt, idx) => {
                      const color = eventColors[idx % eventColors.length];
                      return (
                        <div key={evt.id || idx} className={`p-3 rounded-lg border text-center flex flex-col justify-center gap-1 ${color}`}>
                          <span className="text-sm font-extrabold tracking-tight">{evt.year}</span>
                          <span className="text-xs font-bold">{evt.event}</span>
                          <span className="text-[9px] font-semibold opacity-90">{evt.impact}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lower Data Tables Grid */}
          {activeMenu !== "Evacuation Centres" && (
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

                  <div className="overflow-x-auto">
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
                        {isCentresLoading ? (
                          Array.from({ length: 5 }).map((_, idx) => (
                            <TableRow key={idx} className="animate-pulse border-border">
                              <TableCell><div className="h-4 bg-muted rounded w-16" /></TableCell>
                              <TableCell><div className="h-4 bg-muted rounded w-32" /></TableCell>
                              <TableCell><div className="h-4 bg-muted rounded w-20" /></TableCell>
                              <TableCell><div className="h-4 bg-muted rounded w-12" /></TableCell>
                              <TableCell className="text-right"><div className="h-4 bg-muted rounded w-8 ml-auto" /></TableCell>
                            </TableRow>
                          ))
                        ) : filteredEvacuationCentres.length > 0 ? (
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

                  <div className="overflow-x-auto">
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
                        {isTrackingLoading ? (
                          Array.from({ length: 4 }).map((_, idx) => (
                            <TableRow key={idx} className="animate-pulse border-border">
                              <TableCell><div className="h-24 bg-muted rounded w-24" /></TableCell>
                              <TableCell><div className="h-4 bg-muted rounded w-28" /></TableCell>
                              <TableCell><div className="h-4 bg-muted rounded w-16" /></TableCell>
                              <TableCell className="text-right"><div className="h-4 bg-muted rounded w-12 ml-auto" /></TableCell>
                            </TableRow>
                          ))
                        ) : (
                          responseTracking.map((res, idx) => (
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
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 border-t border-border text-[11px] text-muted-foreground flex items-center gap-1">
                  <Filter className="w-3 h-3 text-muted-foreground/60" />
                  <span>Sector targets updated in database: 2 hours ago.</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
