"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  ChevronRight,
  X,
  Mail,
  Info,
  Tag,
  Sparkles,
  AlertCircle,
  Share2,
  Check,
} from "lucide-react";
import { latestUpdateService } from "@/services/latest-update";
import { LatestUpdate, LatestUpdateCategory } from "@/types/latest-update";
import { UpdateDetailModal } from "./update-detail-modal";
import { LatestUpdateSkeleton } from "./latest-update-skeleton";

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

function getCategoryName(item: LatestUpdate): string {
  if (item.category_details?.name) {
    return item.category_details.name;
  }
  if (item.is_featured) return "Announcement";
  return "Resource";
}

function LatestUpdatesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  const initialCategory = searchParams.get("category") || searchParams.get("filter") || "all";

  const [categories, setCategories] = useState<LatestUpdateCategory[]>([]);
  const [updates, setUpdates] = useState<LatestUpdate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeModalUpdate, setActiveModalUpdate] = useState<LatestUpdate | null>(null);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCopyLink = (id: number | string, customMsg?: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?id=${id}`
        : "";
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id);
        setToastMsg(customMsg || "Direct link copied!");
        setTimeout(() => {
          setCopiedId(null);
          setToastMsg(null);
        }, 2500);
      });
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const fetchedCats = await latestUpdateService.getCategories();
        if (isMounted) {
          setCategories(fetchedCats);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch updates whenever selectedCategory or searchQuery changes
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await latestUpdateService.getLatestUpdates({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
        });

        if (isMounted) {
          setUpdates(data);
          if (initialId && !activeModalUpdate) {
            const matched = data.find((item) => String(item.id) === String(initialId));
            if (matched) {
              setActiveModalUpdate(matched);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load updates:", err);
        if (isMounted) {
          setUpdates([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    const timer = setTimeout(() => {
      loadData();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery, initialId]);

  // Featured update (is_featured === true or fallback to first element)
  const featuredUpdate = useMemo(() => {
    return updates.find((u) => u.is_featured) || updates[0] || null;
  }, [updates]);

  return (
    <div className="bg-background text-foreground font-sans antialiased pb-12 sm:pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-primary py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-primary-foreground/80 mb-4 sm:mb-6 font-medium flex-wrap">
            <Link href="/" className="hover:text-primary-foreground transition-colors flex items-center gap-1">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60 shrink-0" />
            <span className="text-primary-foreground font-semibold">Latest Updates</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch lg:items-end">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 max-w-full text-wrap leading-tight">
                Information and Operational Updates
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
                Latest Updates
              </h1>
              <p className="text-sm sm:text-lg text-primary-foreground/90 max-w-2xl font-normal leading-relaxed">
                Access recent announcements, situation reports, assessments, data releases, meeting outcomes, technical guidance and portal updates from the DECM Cluster.
              </p>
            </div>

            <div className="lg:col-span-1 bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 text-primary-foreground space-y-1.5 sm:space-y-2">
              <strong className="block text-[11px] sm:text-xs uppercase tracking-wider text-primary-foreground font-bold">
                Page Purpose
              </strong>
              <p className="text-xs text-primary-foreground/90 leading-relaxed">
                This page provides a consolidated record of key DECM Cluster information products and operational developments. Content is verified by cluster focal points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:-mt-6 relative z-20 space-y-6 sm:space-y-8">
        {/* Search & Filters Toolbar */}
        <div className="bg-card rounded-2xl border border-border p-3.5 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search updates, reports or resources..."
              className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-border bg-muted/50 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all font-medium"
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

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full" aria-label="Update category filters">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Grid: Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <section className="lg:col-span-8 space-y-6 sm:space-y-8">
            {featuredUpdate && selectedCategory === "all" && !searchQuery && (
              <article className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 group">
                <div className="relative min-h-[180px] sm:min-h-[280px] bg-slate-900 overflow-hidden flex items-end p-5 sm:p-8">
                  {featuredUpdate.thumbnail_image ? (
                    <img
                      src={featuredUpdate.thumbnail_image}
                      alt={featuredUpdate.thumbnail_alt_desc || featuredUpdate.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                  <span className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-primary text-primary-foreground uppercase tracking-wider">
                    Featured Announcement
                  </span>
                </div>

                <div className="p-5 sm:p-8 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                      {parseDateComponents(featuredUpdate.created_at).full}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>DECM Cluster Secretariat</span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug break-words">
                    {featuredUpdate.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                    {featuredUpdate.short_description || featuredUpdate.description}
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveModalUpdate(featuredUpdate)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 hover:gap-2.5 transition-all cursor-pointer group/btn"
                    >
                      <span>Read full update</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-primary">Recent Updates</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {updates.length} update{updates.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {isLoading ? (
              <LatestUpdateSkeleton />
            ) : updates.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <AlertCircle className="w-9 h-9 sm:w-10 sm:h-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-bold text-foreground">No matching updates found</h3>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search filters or search term to see more results.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((item) => {
                  const dateInfo = parseDateComponents(item.created_at);
                  const categoryName = getCategoryName(item);

                  return (
                    <article
                      key={item.id}
                      className="bg-card border border-border hover:border-primary/50 rounded-2xl p-4 sm:p-6 transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start group"
                    >
                      <div className="bg-primary/10 text-primary rounded-xl p-2.5 sm:p-3.5 text-left sm:text-center min-w-0 w-full sm:w-auto sm:min-w-[100px] shrink-0 border border-primary/20 flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                        <span className="font-extrabold text-xl sm:text-3xl leading-none">
                          {dateInfo.day}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary">
                          {dateInfo.monthYear}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2 min-w-0 w-full">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            <Tag className="w-3 h-3 text-primary shrink-0" />
                            {categoryName}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium truncate">
                            • Published {dateInfo.full}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug break-words">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed break-words">
                          {item.short_description || item.description}
                        </p>

                        <div className="pt-2 flex flex-row items-center justify-between gap-2 flex-wrap">
                          <button
                            onClick={() => setActiveModalUpdate(item)}
                            className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 cursor-pointer group/link"
                          >
                            <span>Read full update</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform shrink-0" />
                          </button>

                          <button
                            onClick={() => handleCopyLink(item.id)}
                            className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
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
              <h3 className="text-base sm:text-lg font-bold text-primary border-b border-border pb-3">
                Quick Links
              </h3>
              <div className="divide-y divide-border">
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
                    className="flex items-center justify-between py-2.5 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors group cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Information Notice</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Figures and documents published on this page may be revised following verification. Refer to the publication date and version number before use.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-primary">Contact Secretariat</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For corrections, document submissions or requests for additional information, contact the DECM Cluster team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline cursor-pointer group"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Contact the Secretariat</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <UpdateDetailModal
        update={activeModalUpdate}
        onClose={() => setActiveModalUpdate(null)}
        copiedId={copiedId}
        toastMsg={toastMsg}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}

export function LatestUpdatesView() {
  return (
    <Suspense fallback={<LatestUpdateSkeleton />}>
      <LatestUpdatesContent />
    </Suspense>
  );
}
