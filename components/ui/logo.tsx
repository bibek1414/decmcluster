import React from "react";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md shadow-blue-500/10 border border-blue-400/20 ${className}`}>
      {/* Abstract Grid Icon */}
      <svg
        className="w-3/5 h-3/5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        <circle cx="12" cy="7" r="1" className="fill-white animate-pulse" />
      </svg>
      {/* Decorative pulse ring */}
      <span className="absolute -inset-0.5 rounded-xl border border-blue-400/30 animate-ping opacity-25"></span>
    </div>
  );
}
