"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  ChevronRight,
  X,
  Info,
  Tag,
  AlertTriangle,
  MapPin,
  Users,
  Shield,
  FileText,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useHistoricalEvents } from "@/hooks/use-dashboard";
import { HistoricalEvent } from "@/types/dashboard";

interface DetailedHistoricalEvent extends HistoricalEvent {
  description: string;
  image: string;
  affectedProvinces: string[];
  estimatedDisplaced: string;
  responseStatus: string;
}

const DEFAULT_HISTORICAL_EVENTS: DetailedHistoricalEvent[] = [
  {
    id: 1,
    event: "TC Pam",
    year: 2015,
    impact: "High Impact",
    description:
      "Category 5 tropical cyclone causing catastrophic damage across 5 provinces. Damaged over 17,000 buildings, destroyed water infrastructure, and displaced tens of thousands of residents across Vanuatu.",
    image:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
    affectedProvinces: ["Shefa", "Tafea", "Malampa", "Penama"],
    estimatedDisplaced: "65,000+",
    responseStatus: "Completed",
  },
  {
    id: 2,
    event: "Ambae Volcano",
    year: 2017,
    impact: "Displacement",
    description:
      "Volcanic activity led to a historic mandatory island-wide evacuation. Over 11,000 residents were relocated from Ambae Island to Santo, Maewo, and Pentecost with multi-sector cluster support.",
    image:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
    affectedProvinces: ["Penama", "Sanma"],
    estimatedDisplaced: "11,000+",
    responseStatus: "Completed",
  },
  {
    id: 3,
    event: "TC Harold",
    year: 2020,
    impact: "Severe Impact",
    description:
      "Category 5 cyclone impacting northern islands including Santo, Malekula, and Pentecost during COVID-19 pandemic protocol. Caused major destruction to shelter and health facilities.",
    image:
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    affectedProvinces: ["Sanma", "Penama", "Malampa"],
    estimatedDisplaced: "27,000+",
    responseStatus: "Completed",
  },
  {
    id: 4,
    event: "TC Judy/Kevin",
    year: 2023,
    impact: "Multi-island",
    description:
      "Twin Category 4 and Category 5 tropical cyclones hitting Vanuatu within 48 hours. Affected over 80% of the population, severely damaging electrical grids, water networks, and community centres.",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    affectedProvinces: ["Shefa", "Tafea", "Sanma", "Malampa", "Penama"],
    estimatedDisplaced: "40,000+",
    responseStatus: "Completed",
  },
  {
    id: 5,
    event: "Earthquake",
    year: 2024,
    impact: "Urban Impact",
    description:
      "Moderate to severe seismic activity resulting in structural shaking, localized landslides, and temporary evacuation of urban settlements in Shefa and coastal zones.",
    image:
      "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    affectedProvinces: ["Shefa"],
    estimatedDisplaced: "3,500+",
    responseStatus: "Completed",
  },
];

export function HistoricalEventsView() {
  const { data: apiEvents = [], isLoading } = useHistoricalEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImpact, setSelectedImpact] = useState<string>("all");
  const [activeModalEvent, setActiveModalEvent] = useState<DetailedHistoricalEvent | null>(null);

  // Combine API data with fallback details
  const events = useMemo(() => {
    if (!apiEvents || apiEvents.length === 0) {
      return DEFAULT_HISTORICAL_EVENTS;
    }
    return apiEvents.map((evt, idx) => {
      const fallback = DEFAULT_HISTORICAL_EVENTS[idx % DEFAULT_HISTORICAL_EVENTS.length];
      return {
        id: evt.id || idx + 1,
        event: evt.event || fallback.event,
        year: evt.year || fallback.year,
        impact: evt.impact || fallback.impact,
        description: evt.description || fallback.description,
        image: evt.image || fallback.image,
        affectedProvinces: fallback.affectedProvinces,
        estimatedDisplaced: fallback.estimatedDisplaced,
        responseStatus: fallback.responseStatus,
      };
    });
  }, [apiEvents]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(evt.year).includes(searchQuery) ||
        evt.impact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesImpact =
        selectedImpact === "all" || evt.impact.toLowerCase() === selectedImpact.toLowerCase();
      return matchesSearch && matchesImpact;
    });
  }, [events, searchQuery, selectedImpact]);

  // Unique impact filter options
  const impactTypes = ["all", "High Impact", "Displacement", "Severe Impact", "Multi-island", "Urban Impact"];

  return (
    <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20">
      {/* Hero Header matching screenshot style */}
      <section className="bg-primary py-8 sm:py-12 lg:py-16 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 sm:gap-2 text-xs text-primary-foreground/80 mb-4 sm:mb-6 font-medium flex-wrap"
          >
            <Link href="/" className="hover:text-primary-foreground transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60 shrink-0" />
            <span className="text-primary-foreground font-semibold">Historical Events</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 max-w-full text-wrap leading-tight">
                Disaster Displacement & Historical Events
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                Historical Events Snapshot
              </h1>
              <p className="text-sm sm:text-lg text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
                Major disaster displacement events, evacuation records and impact history tracked in the Vanuatu DECM database.
              </p>
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                This page provides a consolidated record of disaster events, displacement figures, evacuation centre logs and multi-sector response history across Vanuatu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
        {/* Search & Filters Toolbar */}
        <div className="bg-card rounded-2xl border border-border p-3.5 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, year (e.g. 2020), or impact type..."
              className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-border bg-muted/50 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {impactTypes.map((type) => {
              const isActive = selectedImpact.toLowerCase() === type.toLowerCase();
              return (
                <button
                  key={type}
                  onClick={() => setSelectedImpact(type)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 capitalize ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {type === "all" ? "All Impacts" : type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-primary">Disaster Events</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {filteredEvents.length} historical record{filteredEvents.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-72 bg-card border border-border rounded-2xl p-4" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-foreground">No events found matching criteria</h3>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedImpact("all");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/historical-events/${evt.id}`}
                    className="group bg-card text-card-foreground border border-border hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <img
                          src={evt.image}
                          alt={evt.event}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-[11px] font-extrabold px-2.5 py-1 rounded-md border border-border/50 shadow-xs flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>Year {evt.year}</span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="bg-primary/95 text-primary-foreground text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-sm inline-block max-w-full truncate">
                            {evt.impact}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                          {evt.event}
                        </h3>

                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {evt.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
                          <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                            <MapPin className="w-3 h-3 text-primary" />
                            {evt.affectedProvinces.join(", ")}
                          </span>
                          <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                            <Users className="w-3 h-3 text-primary" />
                            {evt.estimatedDisplaced} Displaced
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3.5 bg-muted/20 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-extrabold text-primary group-hover:underline flex items-center gap-1">
                        View Detailed Record
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-primary border-b border-border pb-3">
                Quick Navigation
              </h3>
              <div className="divide-y divide-border">
                {[
                  { label: "Interactive Operational Dashboard", path: "/dashboard" },
                  { label: "PowerBI Analytics Dashboards", path: "/powerbi-dashboards" },
                  { label: "GIS & Evacuation Mapping", path: "/mapping" },
                  { label: "Situation Reports & Assessments", path: "/reports" },
                  { label: "Latest Portal Updates", path: "/latest-updates" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="flex items-center justify-between py-2.5 text-xs font-bold text-foreground hover:text-primary transition-colors group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Info className="w-4 h-4 shrink-0" />
                <span>Historical Database Notice</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Historical displacement logs are archived by the NDMO and DECM Cluster. Data is compiled from rapid displacement assessments (RDAs) and post-disaster needs assessments.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
