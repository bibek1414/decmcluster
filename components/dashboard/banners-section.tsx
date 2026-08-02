"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  FileText,
  GraduationCap,
  AlertTriangle,
  Monitor,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { latestUpdateService } from "@/services/latest-update";
import { LatestUpdate } from "@/types/latest-update";

interface TickerDisplayItem {
  id: string | number;
  title: string;
  date: string;
  icon: React.ElementType;
  badgeBg: string;
  slug?: string;
}

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  primaryColor: string;
  barColor: string;
  badgeBg: string;
  linkText: string;
  href: string;
}

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
    href: "/latest-updates",
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
    href: "/emergency-alerts",
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
    href: "/announcements",
  },
];

function formatDateString(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

export default function BannersSection() {
  const router = useRouter();
  const [updates, setUpdates] = useState<LatestUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUpdates() {
      try {
        const data = await latestUpdateService.getLatestUpdates();
        if (isMounted) {
          setUpdates(data);
        }
      } catch (err) {
        console.error("Failed to load updates in banner:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUpdates();
    return () => {
      isMounted = false;
    };
  }, []);

  // Map API updates into ticker items
  const tickerItems: TickerDisplayItem[] = updates.slice(0, 4).map((item, index) => {
    const icons = [FileText, GraduationCap, AlertTriangle, Monitor];
    const badges = ["bg-blue-600", "bg-teal-600", "bg-amber-600", "bg-purple-600"];
    const IconComponent = icons[index % icons.length];
    const badgeColor = badges[index % badges.length];

    return {
      id: item.id,
      title: item.title,
      date: formatDateString(item.created_at),
      icon: IconComponent,
      badgeBg: badgeColor,
      slug: item.slug,
    };
  });

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-8 select-none">
      {/* Top Section: Dark Blue Latest Updates Ticker Bar */}
     

      {/* Bottom Section: 3 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {FEATURE_CARDS.map((card) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => router.push(card.href)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative cursor-pointer"
            >
              {/* Card Image Banner */}
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 rounded-t-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Overlapping Round Icon Badge */}
              <div className="relative px-6">
                <div
                  className={`absolute -top-6 sm:-top-7 left-6 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${card.badgeBg} flex items-center justify-center text-white border-4 border-white shadow-md`}
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

                {/* View Details Action */}
                <div>
                  <Link
                    href={card.href}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center text-sm font-bold ${card.primaryColor} hover:underline group-hover:translate-x-1 transition-transform cursor-pointer`}
                  >
                    <span>{card.linkText}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
