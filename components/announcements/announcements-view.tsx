"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  X,
  Mail,
  Info,
  Tag,
  Megaphone,
  ExternalLink,
  Share2,
  Check,
} from "lucide-react";
import { announcementService } from "@/services/announcement";
import { Announcement } from "@/types/announcement";

function formatDateComponents(isoString?: string): { day: string; monthYear: string; full: string } {
  if (!isoString) return { day: "--", monthYear: "Active", full: "Date not specified" };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { day: "--", monthYear: "Active", full: isoString };
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear();
    const full = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return { day, monthYear: `${month} ${year}`, full };
  } catch {
    return { day: "--", monthYear: "Active", full: isoString };
  }
}

function AnnouncementsContent() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadAnnouncements() {
      setIsLoading(true);
      try {
        const data = await announcementService.getAnnouncements();
        if (isMounted) {
          setAnnouncements(data);
        }
      } catch (err) {
        console.error("Failed to load announcements:", err);
        if (isMounted) setAnnouncements([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadAnnouncements();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase().trim();
    return announcements.filter(
      (item) => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  }, [announcements, searchQuery]);

  const handleCopyLink = (id: number | string, link: string) => {
    if (link && navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedId(id);
        setToastMsg("Announcement link copied!");
        setTimeout(() => {
          setCopiedId(null);
          setToastMsg(null);
        }, 2500);
      });
    }
  };

  return (
    <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20 select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header with GREEN Theme (#497D39) */}
      <section className="bg-gradient-to-r from-[#22451A] via-[#497D39] to-[#142C10] py-8 sm:py-12 lg:py-16 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-emerald-200 mb-4 sm:mb-6 font-medium flex-wrap">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/60 shrink-0" />
            <span className="text-white font-semibold">Announcements</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-white/15 text-white border border-white/30 max-w-full text-wrap leading-tight">
                <Megaphone className="w-3.5 h-3.5 text-white" />
                Cluster Communications & Notices
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Announcements
              </h1>
              <p className="text-sm sm:text-lg text-emerald-100 max-w-2xl font-normal leading-relaxed">
                Find official announcements, coordination notices, policy updates, and operational messages from the DECM Cluster Secretariat and partner institutions.
              </p>
            </div>

            <div className="lg:col-span-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-emerald-200 font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-emerald-100 leading-relaxed">
                This page lists active announcements and notices verified by DECM Cluster working groups and partner agencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
        {/* Search Toolbar */}
        <div className="bg-card rounded-2xl border border-border p-3.5 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-border bg-muted/50 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#497D39] focus:bg-card transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <section className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-[#497D39] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#497D39]" />
                  Recent Announcements
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center text-muted-foreground text-xs space-y-3">
                <div className="w-8 h-8 border-4 border-[#497D39] border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <Megaphone className="w-9 h-9 sm:w-10 sm:h-10 text-[#497D39] mx-auto" />
                <h3 className="text-base font-bold text-foreground">No announcements found</h3>
                <p className="text-xs text-muted-foreground">
                  {searchQuery
                    ? "No announcements matched your search query."
                    : "There are currently no active announcements listed."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 bg-[#497D39] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((item) => {
                  const dateInfo = formatDateComponents(item.created_at);

                  return (
                    <article
                      key={item.id}
                      className="bg-card border border-emerald-200 dark:border-emerald-900/40 hover:border-[#497D39] rounded-2xl p-4 sm:p-6 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start group shadow-sm"
                    >
                      <div className="bg-emerald-50 text-[#497D39] rounded-xl p-2.5 sm:p-3.5 text-left sm:text-center min-w-0 w-full sm:w-auto sm:min-w-[100px] shrink-0 border border-emerald-200 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                        <span className="font-extrabold text-xl sm:text-3xl leading-none">
                          {dateInfo.day}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#497D39]">
                          {dateInfo.monthYear}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2 min-w-0 w-full">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#497D39] border border-emerald-200">
                            <Tag className="w-3 h-3 text-[#497D39] shrink-0" />
                            Announcement
                          </span>
                          <span className="text-xs text-muted-foreground font-medium truncate">
                            • Issued {dateInfo.full}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-[#497D39] transition-colors leading-snug break-words">
                          {item.title}
                        </h3>

                        <div className="pt-2 flex flex-row items-center justify-between gap-2 flex-wrap border-t border-border/50">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-extrabold text-[#497D39] hover:underline flex items-center gap-1 cursor-pointer group/link"
                          >
                            <span>Open announcement link</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform shrink-0" />
                          </a>

                          <button
                            onClick={() => handleCopyLink(item.id, item.link)}
                            className="text-xs font-bold text-muted-foreground hover:text-[#497D39] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Share or copy direct link"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-emerald-600">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5 shrink-0" />
                                <span>Share</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#497D39] border-b border-border pb-3">
                Quick Links
              </h3>
              <div className="divide-y divide-border">
                {[
                  { label: "Latest Updates", path: "/latest-updates" },
                  { label: "Emergency Alerts", path: "/emergency-alerts" },
                  { label: "Situation reports", path: "/reports" },
                  { label: "Evacuation centre data", path: "/dashboard" },
                  { label: "Maps and dashboards", path: "/mapping" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="flex items-center justify-between py-2.5 text-xs sm:text-sm font-bold text-foreground hover:text-[#497D39] transition-colors group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#497D39] group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#497D39] font-bold text-sm">
                <Info className="w-4 h-4 text-[#497D39] shrink-0" />
                <span>Information Notice</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Announcements and cluster communications are published by authorized cluster focal points and government partners.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-[#497D39]">Contact Secretariat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For announcement submissions or requests, contact the DECM Cluster team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#497D39] hover:underline cursor-pointer group"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Contact the Secretariat</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export function AnnouncementsView() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading announcements page...</div>}>
      <AnnouncementsContent />
    </Suspense>
  );
}
