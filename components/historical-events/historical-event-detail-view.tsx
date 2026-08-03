"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { useHistoricalEvents } from "@/hooks/use-dashboard";

interface HistoricalEventDetailViewProps {
  eventId: number;
}

export function HistoricalEventDetailView({ eventId }: HistoricalEventDetailViewProps) {
  const { data: apiEvents = [], isLoading } = useHistoricalEvents();

  // Match event purely from API response
  const event = useMemo(() => {
    return apiEvents.find((evt) => evt.id === eventId) || null;
  }, [apiEvents, eventId]);


  if (isLoading) {
    return (
      <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20">
        <section className="bg-primary py-8 sm:py-12 lg:py-16 relative overflow-hidden select-none animate-pulse">
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-4">
            <div className="h-4 bg-primary-foreground/20 rounded w-48" />
            <div className="h-10 bg-primary-foreground/20 rounded w-96" />
            <div className="h-6 bg-primary-foreground/20 rounded w-2/3" />
          </div>
        </section>
        <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6">
          <div className="bg-card rounded-2xl border border-border h-14 p-4 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-card border border-border rounded-2xl h-96 animate-pulse" />
            <div className="lg:col-span-4 bg-card border border-border rounded-2xl h-96 animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-background text-foreground font-sans antialiased py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4 bg-card border border-border p-8 rounded-2xl -sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Historical Event Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The requested historical event record (ID: {eventId}) does not exist in the API database.
          </p>
          <Link
            href="/historical-events"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to All Historical Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground  antialiased pb-12 sm:pb-20">
      {/* Hero Header */}
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
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                Historical disaster record for {event.event} maintained in the DECM database.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detail Body */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Event Banner */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden -md">
              {event.image && event.image.trim() !== "" ? (
                <div className="relative h-64 sm:h-96 w-full bg-muted border-b border-border">
                  <img
                    src={event.image}
                    alt={event.event}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/40 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6 text-foreground">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">
                      Disaster Event Overview
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{event.event}</h2>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-primary/90 to-primary p-8 text-primary-foreground space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary-foreground/80 block">
                    Disaster Event Record
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">{event.event} ({event.year})</h2>
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-primary">Event Description & Log</h3>
                <div
                  className="text-sm sm:text-base text-foreground leading-relaxed prose prose-slate dark:prose-invert max-w-none [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: event.description || "<p>No description provided for this event.</p>",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Metrics from API */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 -sm">
              <h3 className="text-base font-bold text-primary border-b border-border pb-3">
              Historical   Event  Details
              </h3>

              <div className="space-y-4">
              

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Event Name</span>
                  <strong className="text-lg font-extrabold text-foreground">{event.event}</strong>
                </div>

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Year</span>
                  <strong className="text-lg font-extrabold text-foreground">{event.year}</strong>
                </div>

                <div className="bg-muted/50 border border-border p-4 rounded-xl space-y-1">
                  <span className="text-xs text-muted-foreground font-semibold block">Impact Level</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {event.impact}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

