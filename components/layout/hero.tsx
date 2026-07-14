import React from "react";
import { Radio, Users, MapPin, Home, Handshake } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#022a4f] text-white min-h-[500px] flex items-center py-16 md:py-24 border-b border-border">
      {/* Background Image on Right Half */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] lg:w-[50%] bg-cover bg-center z-0 hidden md:block"
        style={{
          backgroundImage: `url('/dashboards.jpeg')`,
        }}
      />

      {/* Background Image for Mobile Only */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 md:hidden opacity-30"
        style={{
          backgroundImage: `url('/dashboards.jpeg')`,
        }}
      />

      {/* Gradient Overlay for blending the image into solid dark blue */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#022a4f] via-[#022a4f] md:via-[#022a4f]/90 to-transparent z-0" />

      <div className="absolute right-0 top-6 w-[120px] h-[300px] opacity-15 pointer-events-none z-10 hidden md:block">
        <svg
          viewBox="0 0 40 100"
          className="w-full h-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Repeating diamond chevron traditional patterns */}
          <path d="M0 0 L20 15 L40 0 M0 15 L20 30 L40 15 M0 30 L20 45 L40 30 M0 45 L20 60 L40 45 M0 60 L20 75 L40 60 M0 75 L20 90 L40 75 M0 90 L20 105 L40 90" />
          <path d="M20 0 L20 100" strokeDasharray="1 1" />
          <polygon points="20,7 27,15 20,23 13,15" />
          <polygon points="20,37 27,45 20,53 13,45" />
          <polygon points="20,67 27,75 20,83 13,75" />
        </svg>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Radio Badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-extrabold tracking-wider uppercase mb-5 ">
            <Radio className="w-3.5 h-3.5 text-secondary" />
            Vanuatu preparedness & response
          </span>

          {/* Heading with Golden Underline under "Displacement," */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-[1.15] text-white">
            <span className="relative inline-block pb-1 mr-2">
              Displacement,
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-primary rounded-full" />
            </span>
            Evacuation Centre & Response Information System
          </h2>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl mb-10">
            This portal is a unified platform for the DECM Cluster Vanuatu information management
            system. It coordinates standardized data collection, evacuation centre tracking, village
            assessments, service mapping, post-distribution monitoring, and partner response
            datasets.
          </p>

          {/* 4 Response Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 max-w-3xl">
            {/* Column 1: Coordinated Response */}
            <div className="flex flex-col items-center text-center p-2 sm:border-r border-white/15 last:border-r-0">
              <div className="w-11 h-11 rounded-full border border-white/35 flex items-center justify-center text-white mb-2.5 bg-white/5 shadow-inner">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-white leading-tight">
                Coordinated Response
              </span>
            </div>

            {/* Column 2: Real-time Info */}
            <div className="flex flex-col items-center text-center p-2 sm:border-r border-white/15 last:border-r-0">
              <div className="w-11 h-11 rounded-full border border-white/35 flex items-center justify-center text-white mb-2.5 bg-white/5 shadow-inner">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-white leading-tight">
                Real-time Information
              </span>
            </div>

            {/* Column 3: Evacuation Tracking */}
            <div className="flex flex-col items-center text-center p-2 sm:border-r border-white/15 last:border-r-0">
              <div className="w-11 h-11 rounded-full border border-white/35 flex items-center justify-center text-white mb-2.5 bg-white/5 shadow-inner">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-white leading-tight">
                Evacuation Centre Tracking
              </span>
            </div>

            {/* Column 4: Stronger Together */}
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-11 h-11 rounded-full border border-white/35 flex items-center justify-center text-white mb-2.5 bg-white/5 shadow-inner">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-white leading-tight">
                Stronger Together
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave Divider at the bottom */}
      <div className="absolute left-0 right-0 bottom-0 w-full pointer-events-none z-10 translate-y-[2px]">
        {/* Background color of next section is oklch(0.973 0.0133 286.1503), which is roughly #f4f3f6. We can use currentColor or match it. */}
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-auto fill-current text-[var(--background)]"
          preserveAspectRatio="none"
        >
          {/* Subtle teal wave shadow */}
          <path
            fill="#14b8a6"
            fillOpacity="0.45"
            d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,53.3C1120,43,1280,21,1360,10.7L1440,0L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
          />
          {/* Main background matching wave */}
          <path d="M0,48L80,42.7C160,37,320,27,480,32C640,37,800,59,960,64C1120,69,1280,59,1360,53.3L1440,48L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z" />
        </svg>
      </div>
    </section>
  );
}
