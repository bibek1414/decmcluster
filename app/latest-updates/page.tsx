"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  ChevronRight,
  FileText,
  Megaphone,
  Download,
  ExternalLink,
  X,
  Share2,
  Bell,
  Mail,
  Info,
  CheckCircle,
  AlertCircle,
  Tag,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { latestUpdateService, FALLBACK_LATEST_UPDATES } from "@/services/latest-update";
import { LatestUpdate } from "@/types/latest-update";

function parseDateComponents(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: "31", monthYear: "Jul 2026", full: dateStr };
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
    return { day: "31", monthYear: "Jul 2026", full: dateStr };
  }
}

function LatestUpdatesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  const initialFilter = searchParams.get("filter");

  const [updates, setUpdates] = useState<LatestUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter || "all");
  const [activeModalUpdate, setActiveModalUpdate] = useState<LatestUpdate | null>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await latestUpdateService.getLatestUpdates();
        if (isMounted) {
          setUpdates(data.length > 0 ? data : FALLBACK_LATEST_UPDATES);
          if (initialId) {
            const matched = data.find((item) => String(item.id) === String(initialId));
            if (matched) {
              setActiveModalUpdate(matched);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load updates:", err);
        if (isMounted) {
          setUpdates(FALLBACK_LATEST_UPDATES);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [initialId]);

  // Featured update (is_featured === true or fallback to first element)
  const featuredUpdate = useMemo(() => {
    return updates.find((u) => u.is_featured) || updates[0] || null;
  }, [updates]);

  // Filtered recent updates
  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      // Category match
      const category = (item.category || (item.is_featured ? "announcement" : "resource")).toLowerCase();
      const matchesCategory =
        selectedFilter === "all" ||
        category.includes(selectedFilter.toLowerCase()) ||
        (selectedFilter === "announcement" && item.is_featured);

      // Search term match
      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.short_description.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [updates, selectedFilter, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17324D] font-sans antialiased pb-20">
      {/* Top Banner Bar */}
      <div className="bg-[#082F5F] text-white text-xs font-semibold py-2.5 px-4 shadow-sm border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Displacement and Evacuation Centre Management Cluster
          </span>
          <span className="hidden sm:inline-block tracking-wider uppercase text-blue-200/90 text-[11px] font-bold">
            Vanuatu Information Portal
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#052C57] via-[#0752A3] to-[#082F5F] text-white py-12 lg:py-16 relative overflow-hidden shadow-md">
        {/* Background Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-blue-200 mb-6 font-medium">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60" />
            <span className="text-white font-semibold">Latest Updates</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-blue-400/20 text-[#A9E1F5] border border-blue-300/30">
                <Sparkles className="w-3.5 h-3.5" />
                Information and Operational Updates
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Latest Updates
              </h1>
              <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
                Access recent announcements, situation reports, assessments, data releases, meeting outcomes, technical guidance and portal updates from the DECM Cluster.
              </p>
            </div>

            {/* Page Purpose Card */}
            <div className="lg:col-span-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 text-white shadow-lg space-y-2">
              <strong className="block text-xs uppercase tracking-wider text-[#CDEFFF] font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-blue-50/90 leading-relaxed">
                This page provides a consolidated record of key DECM Cluster information products and operational developments. Content is verified by cluster focal points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        {/* Search & Filters Toolbar */}
        <div className="bg-white rounded-2xl border border-[#DCE5EF] p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search updates, reports or resources..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-sm text-[#17324D] focus:outline-none focus:ring-2 focus:ring-[#0752A3] focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap" aria-label="Update filters">
            {[
              { id: "all", label: "All" },
              { id: "announcement", label: "Announcements" },
              { id: "report", label: "Reports" },
              { id: "resource", label: "Resources" },
            ].map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0752A3] text-white shadow-sm shadow-blue-500/30"
                      : "bg-white border border-[#DCE5EF] text-[#17324D] hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Updates Section (8 cols) */}
          <section className="lg:col-span-8 space-y-8">
            {/* Featured Update Card */}
            {featuredUpdate && selectedFilter === "all" && !searchQuery && (
              <article className="bg-white border border-[#DCE5EF] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="relative min-h-[220px] sm:min-h-[280px] bg-slate-900 overflow-hidden flex items-end p-6 sm:p-8">
                  {featuredUpdate.thumbnail_image ? (
                    <img
                      src={featuredUpdate.thumbnail_image}
                      alt={featuredUpdate.thumbnail_alt_desc || featuredUpdate.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002555] to-[#0752A3]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white text-[#063C77] uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#0752A3]" />
                    Featured Announcement
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-[#5E7185] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0752A3]" />
                      {parseDateComponents(featuredUpdate.created_at).full}
                    </span>
                    <span>•</span>
                    <span>DECM Cluster Secretariat</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#063C77] group-hover:text-[#0752A3] transition-colors leading-snug">
                    {featuredUpdate.title}
                  </h2>

                  <p className="text-sm text-[#5E7185] leading-relaxed">
                    {featuredUpdate.short_description || featuredUpdate.description}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveModalUpdate(featuredUpdate)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0752A3] hover:text-[#063C77] hover:gap-3 transition-all cursor-pointer"
                    >
                      <span>Read full update</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Recent Updates Heading */}
            <div className="flex items-center justify-between border-b border-[#DCE5EF] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#063C77]">Recent Updates</h2>
                <p className="text-xs text-[#5E7185] mt-0.5">
                  Showing {filteredUpdates.length} update{filteredUpdates.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Updates List */}
            {isLoading ? (
              <div className="bg-white border border-[#DCE5EF] rounded-2xl p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#0752A3] animate-spin mx-auto" />
                <p className="text-sm text-[#5E7185] font-medium">Fetching updates from DECM API...</p>
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="bg-white border border-[#DCE5EF] rounded-2xl p-12 text-center space-y-4 shadow-sm">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-[#17324D]">No matching updates found</h3>
                <p className="text-xs text-[#5E7185]">
                  Try adjusting your search filters or search term to see more results.
                </p>
                <button
                  onClick={() => {
                    setSelectedFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-[#0752A3] text-white text-xs font-bold rounded-xl hover:bg-[#063C77] transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUpdates.map((item) => {
                  const dateInfo = parseDateComponents(item.created_at);
                  const isFeaturedItem = item.is_featured;

                  return (
                    <article
                      key={item.id}
                      className="bg-white border border-[#DCE5EF] hover:border-[#BDD4E9] rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col sm:flex-row gap-5 items-start group"
                    >
                      {/* Date Badge */}
                      <div className="bg-[#EAF3FB] text-[#063C77] rounded-xl p-3.5 text-center min-w-[90px] sm:min-w-[100px] shrink-0 border border-blue-100">
                        <span className="block font-extrabold text-2xl sm:text-3xl leading-none">
                          {dateInfo.day}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider mt-1 block text-[#0752A3]">
                          {dateInfo.monthYear}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF3FB] text-[#063C77]">
                            <Tag className="w-3 h-3 text-[#0752A3]" />
                            {isFeaturedItem ? "Featured" : item.category || "Resource"}
                          </span>
                          <span className="text-xs text-[#5E7185] font-medium">
                            • Published {dateInfo.full}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#063C77] group-hover:text-[#0752A3] transition-colors leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#5E7185] line-clamp-3 leading-relaxed">
                          {item.short_description || item.description}
                        </p>

                        <div className="pt-2 flex flex-wrap gap-4 items-center">
                          <button
                            onClick={() => setActiveModalUpdate(item)}
                            className="text-xs font-extrabold text-[#0752A3] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Read full update</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Links Card */}
            <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#063C77] border-b border-[#DCE5EF] pb-3">
                Quick Links
              </h3>
              <div className="divide-y divide-[#DCE5EF]">
                {[
                  { label: "Situation reports", path: "/reports" },
                  { label: "Assessments", path: "/assessments-tools" },
                  { label: "Evacuation centre data", path: "/dashboard" },
                  { label: "Maps and dashboards", path: "/mapping" },
                  { label: "Tools and guidance", path: "/sops" },
                  { label: "Meeting documents", path: "/training" },
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="flex items-center justify-between py-2.5 text-xs sm:text-sm font-bold text-[#17324D] hover:text-[#0752A3] transition-colors group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0752A3] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Notice Card */}
            <div className="bg-[#FFF7DF] border border-[#F0D98A] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Information Notice</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                Figures and documents published on this page may be revised following verification. Refer to the publication date and version number before use.
              </p>
            </div>

            {/* Receive Updates Subscription Card */}
            <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#063C77]">
                <Bell className="w-5 h-5 text-[#0752A3]" />
                <h3 className="text-base font-bold">Receive Updates</h3>
              </div>
              <p className="text-xs text-[#5E7185] leading-relaxed">
                Subscribe to get emergency notices and published IM reports sent directly to your inbox.
              </p>

              {subscribed ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Subscription confirmed! Thank you.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE5EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#0752A3]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0752A3] hover:bg-[#063C77] text-white text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    Subscribe to Updates
                  </button>
                </form>
              )}
            </div>

            {/* Contact Secretariat Card */}
            <div className="bg-white border border-[#DCE5EF] rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#063C77]">Contact Secretariat</h3>
              <p className="text-xs text-[#5E7185] leading-relaxed">
                For corrections, document submissions or requests for additional information, contact the DECM Cluster team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0752A3] hover:underline cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Contact the Secretariat →</span>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal Dialog for Article Detail */}
      {activeModalUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10 rounded-t-3xl">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF3FB] text-[#063C77]">
                  {activeModalUpdate.is_featured ? "Featured Update" : activeModalUpdate.category || "Resource"}
                </span>
                <p className="text-xs text-[#5E7185] font-semibold">
                  Published {parseDateComponents(activeModalUpdate.created_at).full}
                </p>
              </div>
              <button
                onClick={() => setActiveModalUpdate(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1">
              <h2 className="text-2xl font-bold text-[#063C77] leading-snug">
                {activeModalUpdate.title}
              </h2>

              {activeModalUpdate.thumbnail_image && (
                <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-200">
                  <img
                    src={activeModalUpdate.thumbnail_image}
                    alt={activeModalUpdate.thumbnail_alt_desc || activeModalUpdate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-slate max-w-none text-sm text-[#17324D] leading-relaxed whitespace-pre-line">
                {activeModalUpdate.description || activeModalUpdate.short_description}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4 rounded-b-3xl">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: activeModalUpdate.title,
                      text: activeModalUpdate.short_description,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#17324D] hover:bg-white transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#0752A3]" />
                <span>Share Update</span>
              </button>

              <button
                onClick={() => setActiveModalUpdate(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0752A3] hover:bg-[#063C77] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LatestUpdatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-[#0752A3] font-bold text-sm">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading Latest Updates...</span>
          </div>
        </div>
      }
    >
      <LatestUpdatesContent />
    </Suspense>
  );
}
