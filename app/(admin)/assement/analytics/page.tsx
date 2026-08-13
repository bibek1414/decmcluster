"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Users,
  Eye,
  Activity,
  Clock,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  FileText,
  AlertCircle,
  BarChart2,
  MousePointerClick,
  Compass,
  Radio,
  Cpu,
  MapPin,
} from "lucide-react";

interface OverviewData {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
  realtimeUsers?: number;
}

interface DailyTrend {
  date: string;
  activeUsers: number;
  pageViews: number;
}

interface TopPage {
  path: string;
  title: string;
  views: number;
  users: number;
}

interface DeviceItem {
  category: string;
  percentage: number;
  users: number;
}

interface CountryItem {
  country: string;
  users: number;
  percentage: number;
}

interface EventItem {
  name: string;
  count: number;
}

interface SourceItem {
  source: string;
  users: number;
  percentage: number;
}

interface CityItem {
  city: string;
  users: number;
  percentage: number;
}

interface OSItem {
  os: string;
  users: number;
  percentage: number;
}

interface AnalyticsPayload {
  configured: boolean;
  message?: string;
  error?: string;
  data: {
    overview: OverviewData;
    dailyTrends: DailyTrend[];
    topPages: TopPage[];
    deviceBreakdown: DeviceItem[];
    countryBreakdown: CountryItem[];
    topEvents?: EventItem[];
    trafficSources?: SourceItem[];
    cityBreakdown?: CityItem[];
    osBreakdown?: OSItem[];
  };
}

export default function AnalyticsDashboardPage() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const fetchAnalyticsData = async (selectedRange: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: AnalyticsPayload = await res.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(range);
  }, [range]);

  const handleRangeChange = (newRange: "7d" | "30d" | "90d") => {
    setRange(newRange);
    startTransition(() => {
      fetchAnalyticsData(newRange);
    });
  };

  const maxViews = analytics?.data?.dailyTrends
    ? Math.max(...analytics.data.dailyTrends.map((d) => d.pageViews), 1)
    : 1;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-slate-50/50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Web Analytics
            </h1>
            {(analytics?.data?.overview?.realtimeUsers ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                <Radio className="w-3 h-3 text-slate-600 animate-pulse" />
                {analytics?.data?.overview?.realtimeUsers} active now
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time web traffic, user sessions, page impressions, and visitor demographics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Date Range Selector */}
          <div className="inline-flex rounded-lg p-1 bg-slate-200/70 border border-slate-300/70">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  range === r
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalyticsData(range)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-hidden shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {(error || analytics?.error) && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 shrink-0" />
          <div>
            <span className="font-semibold">Analytics Error: </span>
            {error || analytics?.error}
          </div>
        </div>
      )}

      {/* Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Active Users Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Users
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {loading
                ? "..."
                : analytics?.data?.overview?.activeUsers?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Unique visitors in period</p>
          </div>
        </div>

        {/* Sessions Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Sessions
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {loading
                ? "..."
                : analytics?.data?.overview?.sessions?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Total user visits</p>
          </div>
        </div>

        {/* Page Views Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Page Views
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {loading
                ? "..."
                : analytics?.data?.overview?.pageViews?.toLocaleString() ?? 0}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Total page impressions</p>
          </div>
        </div>

        {/* Avg Duration / Bounce Rate */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Duration / Bounce
            </span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between gap-2">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {loading ? "..." : analytics?.data?.overview?.avgSessionDuration ?? "0m 0s"}
            </div>
            <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
              Bounce: {analytics?.data?.overview?.bounceRate ?? "0%"}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Average user engagement time</p>
        </div>
      </div>

      {/* Daily Traffic Trend Chart */}
      <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-slate-700" />
              Daily Traffic & Impressions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Traffic trends per day over the selected period ({range.toUpperCase()})
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-slate-900" />
              Page Views
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-slate-300" />
              Active Users
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-10 pb-2 px-1 sm:px-2 overflow-x-auto">
          <div className="h-44 flex items-end gap-1.5 sm:gap-2">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Loading traffic data...
              </div>
            ) : analytics?.data?.dailyTrends?.length ? (
              analytics.data.dailyTrends.map((item, idx) => {
                const viewHeight = Math.max(10, Math.round((item.pageViews / maxViews) * 100));
                const userHeight = Math.max(6, Math.round((item.activeUsers / maxViews) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 min-w-[24px] flex flex-col items-center gap-1.5 group relative"
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[11px] py-1 px-2 rounded-md shadow-md z-30 whitespace-nowrap pointer-events-none">
                      <span className="font-semibold text-slate-200">{item.date}</span>
                      <span>{item.pageViews} views</span>
                      <span className="text-slate-300">{item.activeUsers} users</span>
                    </div>

                    {/* Bars */}
                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-32">
                      <div
                        style={{ height: `${viewHeight}%` }}
                        className="w-full max-w-[12px] sm:max-w-[14px] bg-slate-900 rounded-t-xs group-hover:bg-slate-800 transition-all"
                      />
                      <div
                        style={{ height: `${userHeight}%` }}
                        className="w-full max-w-[12px] sm:max-w-[14px] bg-slate-300 rounded-t-xs group-hover:bg-slate-400 transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono truncate w-full text-center">
                      {item.date.split("-").slice(1).join("/")}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                No trend data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Visited Pages (2 Columns Wide) */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Top Visited Pages</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Ranked by page views</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[480px] sm:min-w-full">
              <thead>
                <tr className="border-b border-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-2.5 font-medium">Page Title & Path</th>
                  <th className="pb-2.5 font-medium text-right">Views</th>
                  <th className="pb-2.5 font-medium text-right">Users</th>
                  <th className="pb-2.5 font-medium text-right w-20 sm:w-24">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      Loading top pages...
                    </td>
                  </tr>
                ) : analytics?.data?.topPages?.length ? (
                  analytics.data.topPages.map((page, idx) => {
                    const totalViews = analytics.data.overview.pageViews || 1;
                    const percentage = Math.round((page.views / totalViews) * 100);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs md:max-w-sm">
                            {page.title}
                          </div>
                          <div className="font-mono text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-xs">
                            {page.path}
                          </div>
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-900">
                          {page.views.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-medium text-slate-600">
                          {page.users.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                            <span className="font-mono text-slate-500 text-[11px]">{percentage}%</span>
                            <div className="w-10 sm:w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, percentage * 2)}%` }}
                                className="h-full bg-slate-900 rounded-full"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No page view data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Category & Location Breakdown (1 Column Wide) */}
        <div className="space-y-6">
          {/* Device Category Card */}
          <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Device Category</h2>
              </div>
            </div>

            <div className="space-y-3.5">
              {loading ? (
                <div className="py-4 text-center text-slate-400 text-xs">
                  Loading device breakdown...
                </div>
              ) : analytics?.data?.deviceBreakdown?.length ? (
                analytics.data.deviceBreakdown.map((dev, idx) => {
                  const Icon =
                    dev.category.toLowerCase() === "mobile"
                      ? Smartphone
                      : dev.category.toLowerCase() === "tablet"
                      ? Tablet
                      : Monitor;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-700">
                          <Icon className="w-3.5 h-3.5 text-slate-500" />
                          {dev.category}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {dev.percentage}% ({dev.users} users)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${dev.percentage}%` }}
                          className={`h-full rounded-full ${
                            dev.category.toLowerCase() === "desktop"
                              ? "bg-slate-900"
                              : dev.category.toLowerCase() === "mobile"
                              ? "bg-slate-600"
                              : "bg-slate-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs">
                  No device data recorded.
                </div>
              )}
            </div>
          </div>

          {/* Visitor Geographic Location Card */}
          <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Top Geographic Locations</h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {loading ? (
                <div className="py-4 text-center text-slate-400 text-xs">
                  Loading country breakdown...
                </div>
              ) : analytics?.data?.countryBreakdown?.length ? (
                analytics.data.countryBreakdown.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-slate-800 truncate max-w-[140px] sm:max-w-none">{c.country}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{c.users} users</span>
                      <span className="text-slate-400 font-mono text-[11px]">({c.percentage}%)</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-400 text-xs">
                  No location data recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Events & Traffic Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Triggered Events Card */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Top User Events</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Event count</span>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                Loading events...
              </div>
            ) : analytics?.data?.topEvents?.length ? (
              analytics.data.topEvents.map((ev, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-mono text-slate-800 font-medium bg-slate-100 px-2 py-0.5 rounded">
                    {ev.name}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {ev.count.toLocaleString()} counts
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs">
                No event data recorded.
              </div>
            )}
          </div>
        </div>

        {/* Traffic Sources Card */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">User Acquisition Sources</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium font-mono">Channel</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                Loading acquisition sources...
              </div>
            ) : analytics?.data?.trafficSources?.length ? (
              analytics.data.trafficSources.map((src, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{src.source}</span>
                    <span className="font-semibold text-slate-900">
                      {src.users} users ({src.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, src.percentage)}%` }}
                      className="h-full bg-slate-800 rounded-full"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs">
                No acquisition source data recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tertiary Section: OS & Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operating System Breakdown Card */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Operating Systems</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium font-mono">Platform</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                Loading operating systems...
              </div>
            ) : analytics?.data?.osBreakdown?.length ? (
              analytics.data.osBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.os}</span>
                    <span className="font-semibold text-slate-900">
                      {item.users} users ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                      className="h-full bg-slate-700 rounded-full"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs">
                No operating system data recorded.
              </div>
            )}
          </div>
        </div>

        {/* Top Cities Card */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">Visitor Cities</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium font-mono">City</span>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                Loading visitor cities...
              </div>
            ) : analytics?.data?.cityBreakdown?.length ? (
              analytics.data.cityBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-800 truncate max-w-[160px] sm:max-w-none">
                    {item.city}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{item.users} users</span>
                    <span className="text-slate-400 font-mono text-[11px]">({item.percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs">
                No city data recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
