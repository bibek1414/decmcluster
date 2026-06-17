import React from "react";
import Image from "next/image";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-white overflow-hidden border border-border/20 shadow-sm ${className}`}
    >
      <Image
        src="/decmlogo.jpeg"
        alt="DECM Cluster Logo"
        width={80}
        height={80}
        priority
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
}

