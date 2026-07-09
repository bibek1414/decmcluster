"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/components/ui/logo";

const VALID_PATHS = [
  "/",
  "/dashboard",
  "/mapping",
  "/assessments-tools",
  "/reports",
  "/sops",
  "/response-tracking",
  "/training",
  "/partners",
  "/links",
  "/contact",
];

export default function Header() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/assement");
  const is404Path = pathname && !isAdminPath && !VALID_PATHS.includes(pathname);

  if (isAdminPath || is404Path) return null;

  return (
    <header className="bg-primary text-primary-foreground border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          {/* Left: Logo + Title */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Logo className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h1 className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight break-words">
                DECM Cluster Information Management and Data Portal
              </h1>
              <p className="text-[10px] sm:text-xs text-primary-foreground/80 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1">
                <span>Vanuatu</span>
                <span className="w-1 h-1 rounded-full bg-primary-foreground/35 flex-shrink-0" />
                <span>NDMO, IOM & Cluster Partners</span>
              </p>
            </div>
          </div>

          {/* Right: Partner logos */}
          <div className="flex items-start gap-3 sm:gap-4 flex-shrink-0 flex-wrap">
            {/* Co-lead */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-primary-foreground/80 font-bold whitespace-nowrap">
                Co-lead
              </span>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md flex items-center gap-2 sm:gap-3 shadow-sm">
                <Image
                  src="/nationaldisaster.jpeg"
                  alt="National Disaster Management Office"
                  width={60}
                  height={40}
                  className="h-6 sm:h-8 w-auto object-contain flex-shrink-0"
                />
                <Image
                  src="/iom.png"
                  alt="IOM"
                  width={70}
                  height={40}
                  className="h-6 sm:h-8 w-auto object-contain flex-shrink-0"
                />
              </div>
            </div>

            {/* Supported by */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] sm:text-xs uppercase tracking-wider text-primary-foreground/80 font-bold whitespace-nowrap">
                Supported by
              </span>
              <div className="bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md flex items-center shadow-sm">
                <Image
                  src="/australinaaid.png"
                  alt="Australian Aid"
                  width={100}
                  height={100}
                  className="h-6 sm:h-8 w-auto object-contain flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
