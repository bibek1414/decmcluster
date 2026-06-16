import React from "react";

export default function Hero() {
  return (
    <section 
      className="relative overflow-hidden bg-cover bg-center py-14 text-white shadow-inner"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(4, 46, 91, 0.94), rgba(10, 80, 150, 0.88)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200')`
      }}
    >
      {/* Decorative vector shape overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
        <svg className="w-full h-full text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100,0 L100,100 L0,100 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/20 text-xs font-semibold mb-4 animate-pulse">
            Vanuatu preparedness & response
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Displacement, Evacuation Centre & Response Information System
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            This portal is a unified platform for the DECM Cluster Vanuatu information management system. 
            It coordinates standardized data collection, evacuation centre tracking, village assessments, 
            service mapping, post-distribution monitoring, and partner response datasets.
          </p>
        </div>
      </div>
    </section>
  );
}
