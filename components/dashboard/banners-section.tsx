"use client";

import React from "react";
import {
  Megaphone,
  FileText,
  GraduationCap,
  AlertTriangle,
  Monitor,
  ArrowRight,
} from "lucide-react";

interface TickerItem {
  id: string;
  title: string;
  date: string;
  icon: React.ElementType;
  badgeBg: string;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  primaryColor: string; // Tailwind text color
  barColor: string; // Tailwind bg color
  badgeBg: string; // Tailwind bg color for circle icon
  linkText: string;
}

const TICKER_UPDATES: TickerItem[] = [
  {
    id: "1",
    title: "New Situation Report Published",
    date: "22 May 2025",
    icon: FileText,
    badgeBg: "bg-blue-600",
  },
  {
    id: "2",
    title: "IM Training Registration Now Open",
    date: "20 May 2025",
    icon: GraduationCap,
    badgeBg: "bg-teal-600",
  },
  {
    id: "3",
    title: "Tropical Cyclone Advisory for Northern Provinces",
    date: "19 May 2025",
    icon: AlertTriangle,
    badgeBg: "bg-red-500",
  },
  {
    id: "4",
    title: "DECM Portal Version 1.2 Released",
    date: "18 May 2025",
    icon: Monitor,
    badgeBg: "bg-purple-600",
  },
];

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: "updates",
    title: "Latest Updates",
    description:
      "Stay informed with the latest situation reports, assessments, data releases and portal updates from the DECM Cluster.",
    image: "/images/banners/latest-updates.png",
    icon: FileText,
    primaryColor: "text-[#0B4893]",
    barColor: "bg-[#0B4893]",
    badgeBg: "bg-[#0B4893]",
    linkText: "View Latest Updates",
  },
  {
    id: "alerts",
    title: "Emergency Alerts",
    description:
      "View active alerts, early warnings and critical information to support preparedness and response across Vanuatu.",
    image: "/images/banners/emergency-alerts.png",
    icon: AlertTriangle,
    primaryColor: "text-[#DC2626]",
    barColor: "bg-[#DC2626]",
    badgeBg: "bg-[#DC2626]",
    linkText: "View Emergency Alerts",
  },
  {
    id: "announcements",
    title: "Announcements",
    description:
      "Find important announcements, coordination notices, policy updates and messages from the DECM Cluster and partners.",
    image: "/images/banners/announcements.png",
    icon: Megaphone,
    primaryColor: "text-[#497D39]",
    barColor: "bg-[#497D39]",
    badgeBg: "bg-[#497D39]",
    linkText: "View Announcements",
  },
];

export default function BannersSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 select-none">
      {/* Top Section: Dark Blue Latest Updates Ticker Bar */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#00275B] via-[#001D47] to-[#001433] p-4 sm:p-5 text-white -xl border border-blue-900/40">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          {/* Header Badge */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#00275B] -md shrink-0">
              <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-white">
                LATEST
              </span>
              <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-blue-100">
                UPDATES
              </span>
            </div>
          </div>

          {/* Updates Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-0 w-full xl:divide-x xl:divide-white/20">
            {TICKER_UPDATES.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.id} className="flex items-center gap-3 px-2 sm:px-3">
                  <div
                    className={`w-9 h-9 rounded-full ${item.badgeBg} text-white flex items-center justify-center shrink-0 -sm`}
                  >
                    <ItemIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="text-xs font-semibold text-white truncate"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                    <span className="text-[11px] text-blue-200/80 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button (No-op action for now) */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/30 text-white text-xs font-medium hover:bg-white/10 transition-colors shrink-0 whitespace-nowrap cursor-pointer self-end lg:self-auto"
          >
            View All Updates <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Section: 3 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {FEATURE_CARDS.map((card) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 -sm hover:-xl transition-all duration-300 flex flex-col group relative"
            >
              {/* Card Image Banner */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 rounded-t-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Overlapping Round Icon Badge (Unclipped) */}
              <div className="relative px-6">
                <div
                  className={`absolute -top-6 sm:-top-7 left-6 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${card.badgeBg} flex items-center justify-center text-white border-4 border-white -md`}
                >
                  <CardIcon className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>
              </div>

              {/* Card Content Body */}
              <div className="pt-8 sm:pt-9 px-6 pb-6 flex flex-col flex-1">
                <h3 className={`text-xl sm:text-2xl font-bold ${card.primaryColor}`}>
                  {card.title}
                </h3>

                {/* Decorative underline bar */}
                <div className={`w-8 h-1 ${card.barColor} rounded-full my-3`} />

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 flex-1 font-normal">
                  {card.description}
                </p>

                {/* View Details Action (No-op action for now) */}
                <div>
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className={`inline-flex items-center text-sm font-bold ${card.primaryColor} hover:underline group-hover:translate-x-1 transition-transform cursor-pointer`}
                  >
                    {card.linkText}{" "}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

