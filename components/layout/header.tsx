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
  "/contact"
];

export default function Header() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/assement");
  const is404Path = pathname && !isAdminPath && !VALID_PATHS.includes(pathname);

  if (isAdminPath || is404Path) return null;
  return (
    <header className="bg-primary text-primary-foreground border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Logo className="w-14 h-14 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate">
                DECM Cluster Information Management and Data Portal
              </h1>
              <p className="text-xs sm:text-sm text-primary-foreground/85 font-medium flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                <span>Vanuatu</span>
                <span className="w-1 h-1 rounded-full bg-primary-foreground/35 flex-shrink-0"></span>
                <span className="truncate">NDMO, IOM & Cluster Partners</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 self-start md:self-auto flex-shrink-0 bg-white">
            <div className="flex flex-col gap-1 flex-shrink-0">
              <span className="text-sm uppercase tracking-wider text-primary font-bold text-center whitespace-nowrap">
                Co-lead
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <Image
                    src="/nationaldisaster.jpeg"
                    alt="National Disaster"
                    width={60}
                    height={40}
                    className="w-auto object-contain"
                  />
                </div>
                <div className="bg-white flex-shrink-0">
                  <Image
                    src="/iom.png"
                    alt="IOM"
                    width={70}
                    height={40}
                    className="w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-shrink-0">
              <span className="text-sm uppercase tracking-wider text-primary font-bold whitespace-nowrap">
                Supported by
              </span>
              <div className="flex-shrink-0">
                <Image
                  src="/australinaaid.png"
                  alt="Australian Aid"
                  width={70}
                  height={30}
                  className="w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
