import React from "react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-center py-14 text-primary-foreground border-b border-border"
      style={{
        backgroundImage: `linear-gradient(to right, var(--primary), color-mix(in srgb, var(--primary) 70%, transparent)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200')`,
      }}
    >
      {/* Decorative vector shape overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none hidden md:block">
        <svg
          className="w-full h-full text-primary-foreground"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M100,0 L100,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20 text-xs font-semibold mb-4">
            Vanuatu preparedness & response
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Displacement, Evacuation Centre & Response Information System
          </h2>
          <p className="text-sm sm:text-base text-primary-foreground/90 leading-relaxed max-w-2xl">
            This portal is a unified platform for the DECM Cluster Vanuatu
            information management system. It coordinates standardized data
            collection, evacuation centre tracking, village assessments, service
            mapping, post-distribution monitoring, and partner response
            datasets.
          </p>
        </div>
      </div>
    </section>
  );
}
