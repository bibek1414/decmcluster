"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  MapPin,
  Users,
  ShieldCheck,
  FileText,
  ArrowLeft,
  Share2,
  Check,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { useHistoricalEvents } from "@/hooks/use-dashboard";
import { HistoricalEvent } from "@/types/dashboard";

interface DetailedHistoricalEvent extends HistoricalEvent {
  description: string;
  image: string;
  affectedProvinces: string[];
  estimatedDisplaced: string;
  responseStatus: string;
  evacuationCentresOpened?: number;
  keyImpactHighlights?: string[];
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
    evacuationCentresOpened: 184,
    keyImpactHighlights: [
      "Widespread shelter destruction across Shefa and Tafea provinces",
      "Over 80% of rural health facilities affected",
      "Major displacement tracking matrix (DTM) rollout by NDMO & IOM",
      "Emergency food and WASH relief delivered to 188,000 individuals",
    ],
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
    evacuationCentresOpened: 62,
    keyImpactHighlights: [
      "Island-wide mandatory evacuation order executed by Government of Vanuatu",
      "Establishment of secondment evacuation sites in Maewo and Luganville",
      "Deployment of DECM Cluster displacement registration protocols",
      "Long-term volcanic ash monitoring and safe return planning",
    ],
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
    evacuationCentresOpened: 95,
    keyImpactHighlights: [
      "Luganville urban area and surrounding agricultural zones severely damaged",
      "Complex relief response executed under strict COVID-19 quarantine protocols",
      "Distribution of tarpaulins, solar lamps, and hygiene kits to displaced families",
      "Rebuilding of damaged evacuation centers and community safe houses",
    ],
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
    evacuationCentresOpened: 142,
    keyImpactHighlights: [
      "Unprecedented double cyclone landfall within a 48-hour timeframe",
      "Port Vila and surrounding Efate rural communities suffered widespread power outages",
      "Cluster rapid needs assessment conducted across 6 provinces",
      "Emergency displacement centers activated for over 25,000 households",
    ],
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
    evacuationCentresOpened: 18,
    keyImpactHighlights: [
      "Moderate structural shaking impacting coastal settlements and public infrastructure",
      "Precautionary tsunami warnings triggered rapid coastal evacuation to high ground",
      "Structural safety inspections completed on public school and health buildings",
      "Short-term displacement relief managed by Municipal PEOC teams",
    ],
  },
];

interface HistoricalEventDetailViewProps {
  eventId: number;
}

export function HistoricalEventDetailView({ eventId }: HistoricalEventDetailViewProps) {
  const { data: apiEvents = [] } = useHistoricalEvents();
  const [copied, setCopied] = React.useState(false);

  const event = useMemo(() => {
    const apiMatch = apiEvents.find((evt) => evt.id === eventId);
    const fallbackMatch = DEFAULT_HISTORICAL_EVENTS.find((evt) => evt.id === eventId) || DEFAULT_HISTORICAL_EVENTS[0];

    if (apiMatch) {
      return {
        ...fallbackMatch,
        id: apiMatch.id,
        event: apiMatch.event || fallbackMatch.event,
        year: apiMatch.year || fallbackMatch.year,
        impact: apiMatch.impact || fallbackMatch.impact,
        description: apiMatch.description || fallbackMatch.description,
        image: apiMatch.image || fallbackMatch.image,
      };
    }
    return fallbackMatch;
  }, [apiEvents, eventId]);

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

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
            <Link href="/historical-events" className="hover:text-primary-foreground transition-colors">
              Historical Events
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60 shrink-0" />
            <span className="text-primary-foreground font-semibold">{event.event}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30">
                  {event.impact}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  {event.year}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                {event.event} ({event.year})
              </h1>

              <p className="text-sm sm:text-lg text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                Detailed historical event log and operational impact record for {event.event} maintained by the DECM Cluster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detail Body */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
        {/* Navigation Bar */}
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm">
          <Link
            href="/historical-events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Historical Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Event Link</span>
              </>
            )}
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Event Hero Banner Image */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
              <div className="relative h-64 sm:h-96 w-full bg-slate-900">
                <img
                  src={event.image}
                  alt={event.event}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 block">
                    Disaster Event Overview
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{event.event}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-primary">Operational Description & Context</h3>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Key Impact Highlights */}
                {event.keyImpactHighlights && event.keyImpactHighlights.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-base font-bold text-foreground">Key Impact & Cluster Response Highlights</h3>
                    <ul className="space-y-2.5">
                      {event.keyImpactHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Metrics */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-primary border-b border-border pb-3">
                Event Statistics & Metrics
              </h3>

              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Displaced Population</span>
                  <strong className="text-2xl font-extrabold text-primary">{event.estimatedDisplaced}</strong>
                </div>

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Evacuation Centres Activated</span>
                  <strong className="text-xl font-extrabold text-foreground">
                    {event.evacuationCentresOpened || 45} Centres
                  </strong>
                </div>

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Affected Provinces</span>
                  <strong className="text-sm font-extrabold text-foreground">
                    {event.affectedProvinces.join(", ")}
                  </strong>
                </div>

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Response Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {event.responseStatus}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Evacuation Dashboard</span>
                </Link>

                <Link
                  href="/powerbi-dashboards"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground text-xs font-extrabold rounded-xl hover:bg-muted transition-colors"
                >
                  <span>PowerBI Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
