"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useBanners } from "@/hooks/use-banners";
import { BannerData } from "@/types/banner";

export default function BannersSection() {
  const { data: banners, isLoading, isError } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);

  // Responsively calculate the number of visible items in the carousel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset index if visibleCount or banners change to prevent out of bounds
  useEffect(() => {
    if (!banners) return;
    const maxIndex = Math.max(0, banners.length - visibleCount);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, banners, currentIndex]);

  if (isLoading) {
    return (
      <div className="w-full flex overflow-hidden select-none">
        {Array.from({ length: visibleCount }).map((_, idx) => (
          <div
            key={idx}
            className="shrink-0"
            style={{ width: `${100 / visibleCount}%` }}
          >
            <div className="animate-pulse relative overflow-hidden h-[260px] xs:h-[300px] sm:h-[340px] md:h-[380px] lg:h-[500px] bg-slate-900 flex flex-col items-center pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6">
              {/* Title Placeholder */}
              <div className="h-6 sm:h-8 w-40 sm:w-56 bg-slate-800 rounded-md mb-3" />
              {/* Description Lines Placeholders */}
              <div className="h-3 sm:h-4 w-48 sm:w-64 bg-slate-800/80 rounded-md mb-2" />
              <div className="h-3 sm:h-4 w-32 sm:w-48 bg-slate-800/80 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !banners || banners.length === 0) {
    return null; // Fallback handled inside service, but double safety
  }

  const showCarousel = banners.length > visibleCount;
  const maxIndex = Math.max(0, banners.length - visibleCount);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="w-full relative group/carousel select-none">
      <div className="relative">
        {/* Navigation Buttons — hidden on mobile, shown on hover for desktop */}
        {showCarousel && (
          <>
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center p-2 sm:p-3 rounded-full bg-slate-900/70 hover:bg-primary text-white border border-white/10 shadow-lg backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center p-2 sm:p-3 rounded-full bg-slate-900/70 hover:bg-primary text-white border border-white/10 shadow-lg backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Edge-to-edge track — no gaps, no rounding, matches reference */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="shrink-0" style={{ width: `${100 / visibleCount}%` }}>
                <BannerCard banner={banner} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicators/Dots — only when carousel is active */}
        {showCarousel && (
          <div className="flex justify-center items-center gap-1.5 mt-4 sm:mt-5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-5 sm:w-6 bg-primary"
                    : "w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BannerCard({ banner }: { banner: BannerData }) {
  return (
    <div className="group relative overflow-hidden h-[260px] xs:h-[300px] sm:h-[340px] md:h-[380px] lg:h-[500px] bg-slate-950">
      {/* Background Image with Hover Scale */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url('${banner.image}')`,
        }}
      />

      {/* Top gradient overlay — anchors the title/description like the reference */}
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent z-10 pointer-events-none" />

      {/* Subtle bottom shade for balance */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />

      {/* Content pinned to the top, matching reference layout */}
      <div className="relative z-20 flex flex-col items-center h-full pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 text-center text-white">
        <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 sm:mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
          {banner.title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-xs sm:max-w-sm font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
          {banner.description}
        </p>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/40 transition-colors duration-300 z-30 pointer-events-none" />
    </div>
  );
}
