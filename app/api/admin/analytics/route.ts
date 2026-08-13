import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

function getMockAnalyticsData(range: string) {
  const days = range === "90d" ? 90 : range === "30d" ? 30 : 7;
  const mockDailyTrends = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const baseUsers = Math.floor(120 + Math.sin(i * 0.5) * 45 + (i % 3) * 15);
    const baseViews = Math.floor(baseUsers * 2.8 + (i % 5) * 20);

    mockDailyTrends.push({
      date: dateStr,
      activeUsers: baseUsers,
      pageViews: baseViews,
    });
  }

  return {
    overview: {
      activeUsers: days === 90 ? 8420 : days === 30 ? 3150 : 890,
      sessions: days === 90 ? 11200 : days === 30 ? 4200 : 1180,
      pageViews: days === 90 ? 28900 : days === 30 ? 10500 : 2940,
      avgSessionDuration: "2m 45s",
      bounceRate: "34.2%",
    },
    dailyTrends: mockDailyTrends,
    topPages: [
      { path: "/", title: "Homepage | DECM Cluster Vanuatu", views: 1420, users: 650 },
      { path: "/mapping", title: "Spatial GIS Mapping Portal", views: 890, users: 430 },
      { path: "/dashboard", title: "Displacement Dashboard", views: 640, users: 310 },
      { path: "/assessments-tools", title: "Assessment Tools & Forms", views: 420, users: 210 },
      { path: "/situational-reports", title: "Situational Reports", views: 310, users: 180 },
      { path: "/response-tracking", title: "5W Response Tracking", views: 240, users: 120 },
      { path: "/emergency-alerts", title: "Emergency Alerts", views: 180, users: 95 },
    ],
    deviceBreakdown: [
      { category: "Desktop", percentage: 58, users: 516 },
      { category: "Mobile", percentage: 38, users: 338 },
      { category: "Tablet", percentage: 4, users: 36 },
    ],
    countryBreakdown: [
      { country: "Vanuatu", users: 540, percentage: 60.7 },
      { country: "Australia", users: 150, percentage: 16.8 },
      { country: "Fiji", users: 85, percentage: 9.5 },
      { country: "New Zealand", users: 65, percentage: 7.3 },
      { country: "United States", users: 50, percentage: 5.7 },
    ],
  };
}

function getAnalyticsClient() {
  // Method 1: GA_SERVICE_ACCOUNT_JSON (single string in env)
  if (process.env.GA_SERVICE_ACCOUNT_JSON) {
    try {
      const raw = process.env.GA_SERVICE_ACCOUNT_JSON.trim();
      const jsonStr = raw.startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf-8");
      const credentials = JSON.parse(jsonStr);
      return new BetaAnalyticsDataClient({ credentials });
    } catch (e) {
      console.error("Failed to parse GA_SERVICE_ACCOUNT_JSON:", e);
    }
  }

  // Method 2: GA_CLIENT_EMAIL & GA_PRIVATE_KEY
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  let privateKey = process.env.GA_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
    return new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }

  // Method 3: OAuth2 Client ID & Client Secret with Refresh Token
  const clientId = process.env.GA_CLIENT_ID;
  const clientSecret = process.env.GA_CLIENT_SECRET;
  const refreshToken = process.env.GA_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    return new BetaAnalyticsDataClient({
      credentials: {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        type: "authorized_user",
      },
    });
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "7d";

  let startDate = "7daysAgo";
  if (range === "30d") startDate = "30daysAgo";
  if (range === "90d") startDate = "90daysAgo";

  const propertyId = process.env.GA_PROPERTY_ID || "549834683";
  const analyticsDataClient = getAnalyticsClient();

  // Fallback to sample data if credentials are missing
  if (!analyticsDataClient) {
    const hasOAuthSecrets = process.env.GA_CLIENT_ID && process.env.GA_CLIENT_SECRET;
    const msg = hasOAuthSecrets
      ? "Google OAuth Client ID & Secret configured. To complete live GA4 streaming, add GA_CLIENT_EMAIL and GA_PRIVATE_KEY (or GA_SERVICE_ACCOUNT_JSON) from your Service Account in Google Cloud Console."
      : "Google Analytics credentials not fully configured in .env.local";

    return NextResponse.json({
      configured: false,
      message: msg,
      propertyId,
      data: getMockAnalyticsData(range),
    });
  }

  try {
    const property = `properties/${propertyId}`;

    const [
      overviewResResult,
      trendResResult,
      pagesResResult,
      deviceResResult,
      countryResResult,
      realtimeOverviewResult,
      realtimePagesResult,
      realtimeDeviceResult,
      realtimeCountryResult,
      realtimeEventsResult,
      realtimeSourcesResult,
    ] = await Promise.allSettled([
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        limit: 10,
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        limit: 5,
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      }),
      // Realtime Query 1: Overview
      analyticsDataClient.runRealtimeReport({
        property,
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      }),
      // Realtime Query 2: Top Pages (using unifiedScreenName dimension)
      analyticsDataClient.runRealtimeReport({
        property,
        dimensions: [{ name: "unifiedScreenName" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        limit: 10,
      }),
      // Realtime Query 3: Devices
      analyticsDataClient.runRealtimeReport({
        property,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      }),
      // Realtime Query 4: Countries
      analyticsDataClient.runRealtimeReport({
        property,
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        limit: 5,
      }),
      // Realtime Query 5: Event Name Breakdown
      analyticsDataClient.runRealtimeReport({
        property,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        limit: 6,
      }),
      // Realtime Query 6: User Traffic Source
      analyticsDataClient.runRealtimeReport({
        property,
        dimensions: [{ name: "firstUserSource" }],
        metrics: [{ name: "activeUsers" }],
        limit: 5,
      }),
    ]);

    const overviewRes = overviewResResult.status === "fulfilled" ? overviewResResult.value[0] : null;
    const trendRes = trendResResult.status === "fulfilled" ? trendResResult.value[0] : null;
    const pagesRes = pagesResResult.status === "fulfilled" ? pagesResResult.value[0] : null;
    const deviceRes = deviceResResult.status === "fulfilled" ? deviceResResult.value[0] : null;
    const countryRes = countryResResult.status === "fulfilled" ? countryResResult.value[0] : null;

    const realtimeOverview = realtimeOverviewResult.status === "fulfilled" ? realtimeOverviewResult.value[0] : null;
    const realtimePages = realtimePagesResult.status === "fulfilled" ? realtimePagesResult.value[0] : null;
    const realtimeDevice = realtimeDeviceResult.status === "fulfilled" ? realtimeDeviceResult.value[0] : null;
    const realtimeCountry = realtimeCountryResult.status === "fulfilled" ? realtimeCountryResult.value[0] : null;
    const realtimeEvents = realtimeEventsResult.status === "fulfilled" ? realtimeEventsResult.value[0] : null;
    const realtimeSources = realtimeSourcesResult.status === "fulfilled" ? realtimeSourcesResult.value[0] : null;

    // Realtime overview metrics (last 30 minutes)
    const rtRow = realtimeOverview?.rows?.[0]?.metricValues || [];
    const realtimeUsers = parseInt(rtRow[0]?.value || "0", 10);
    const realtimeViews = parseInt(rtRow[1]?.value || "0", 10);

    // Standard overview metrics
    const overviewRow = overviewRes?.rows?.[0]?.metricValues || [];
    let activeUsers = parseInt(overviewRow[0]?.value || "0", 10);
    let sessions = parseInt(overviewRow[1]?.value || "0", 10);
    let pageViews = parseInt(overviewRow[2]?.value || "0", 10);
    const avgSec = parseFloat(overviewRow[3]?.value || "0");
    const bounceVal = (parseFloat(overviewRow[4]?.value || "0") * 100).toFixed(1);

    // If historical batch report hasn't processed today's events yet, use realtime numbers
    if (activeUsers === 0 && realtimeUsers > 0) {
      activeUsers = realtimeUsers;
    }
    if (pageViews === 0 && realtimeViews > 0) {
      pageViews = realtimeViews;
    }
    if (sessions === 0 && realtimeUsers > 0) {
      sessions = realtimeUsers;
    }

    const minutes = Math.floor(avgSec / 60);
    const seconds = Math.floor(avgSec % 60);
    const avgSessionDuration = `${minutes}m ${seconds}s`;

    // Daily Trends
    let dailyTrends = (trendRes?.rows || []).map((row) => {
      const dStr = row.dimensionValues?.[0]?.value || "";
      const formattedDate =
        dStr.length === 8
          ? `${dStr.substring(0, 4)}-${dStr.substring(4, 6)}-${dStr.substring(6, 8)}`
          : dStr;
      return {
        date: formattedDate,
        activeUsers: parseInt(row.metricValues?.[0]?.value || "0", 10),
        pageViews: parseInt(row.metricValues?.[1]?.value || "0", 10),
      };
    });

    if (dailyTrends.length === 0 && realtimeUsers > 0) {
      const todayStr = new Date().toISOString().split("T")[0];
      dailyTrends = [
        {
          date: todayStr,
          activeUsers: realtimeUsers,
          pageViews: realtimeViews || realtimeUsers,
        },
      ];
    }

    // Top Pages
    let topPages = (pagesRes?.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || "/",
      title: row.dimensionValues?.[1]?.value || "Untitled Page",
      views: parseInt(row.metricValues?.[0]?.value || "0", 10),
      users: parseInt(row.metricValues?.[1]?.value || "0", 10),
    }));

    if (topPages.length === 0 && realtimePages?.rows?.length) {
      topPages = realtimePages.rows.map((row) => {
        const rawScreen = row.dimensionValues?.[0]?.value || "Homepage";
        const views = parseInt(row.metricValues?.[0]?.value || "0", 10);
        const users = parseInt(row.metricValues?.[1]?.value || "0", 10) || views;

        return {
          path: rawScreen.startsWith("/") ? rawScreen : "/",
          title: rawScreen,
          views,
          users,
        };
      });
    }

    // Device Breakdown
    const totalDeviceUsers = (deviceRes?.rows || []).reduce(
      (acc, r) => acc + parseInt(r.metricValues?.[0]?.value || "0", 10),
      0
    );
    let deviceBreakdown = (deviceRes?.rows || []).map((row) => {
      const u = parseInt(row.metricValues?.[0]?.value || "0", 10);
      const cat = row.dimensionValues?.[0]?.value || "Other";
      const capCat = cat.charAt(0).toUpperCase() + cat.slice(1);
      return {
        category: capCat,
        users: u,
        percentage: totalDeviceUsers ? Math.round((u / totalDeviceUsers) * 100) : 0,
      };
    });

    if (deviceBreakdown.length === 0 && realtimeDevice?.rows?.length) {
      const totalRtUsers = realtimeDevice.rows.reduce(
        (acc, r) => acc + parseInt(r.metricValues?.[0]?.value || "0", 10),
        0
      );
      deviceBreakdown = realtimeDevice.rows.map((row) => {
        const u = parseInt(row.metricValues?.[0]?.value || "0", 10);
        const cat = row.dimensionValues?.[0]?.value || "Other";
        const capCat = cat.charAt(0).toUpperCase() + cat.slice(1);
        return {
          category: capCat,
          users: u,
          percentage: totalRtUsers ? Math.round((u / totalRtUsers) * 100) : 0,
        };
      });
    }

    // Country Breakdown
    const totalCountryUsers = (countryRes?.rows || []).reduce(
      (acc, r) => acc + parseInt(r.metricValues?.[0]?.value || "0", 10),
      0
    );
    let countryBreakdown = (countryRes?.rows || []).map((row) => {
      const u = parseInt(row.metricValues?.[0]?.value || "0", 10);
      return {
        country: row.dimensionValues?.[0]?.value || "Unknown",
        users: u,
        percentage: totalCountryUsers ? parseFloat(((u / totalCountryUsers) * 100).toFixed(1)) : 0,
      };
    });

    if (countryBreakdown.length === 0 && realtimeCountry?.rows?.length) {
      const totalRtCountries = realtimeCountry.rows.reduce(
        (acc, r) => acc + parseInt(r.metricValues?.[0]?.value || "0", 10),
        0
      );
      countryBreakdown = realtimeCountry.rows.map((row) => {
        const u = parseInt(row.metricValues?.[0]?.value || "0", 10);
        return {
          country: row.dimensionValues?.[0]?.value || "Unknown",
          users: u,
          percentage: totalRtCountries ? parseFloat(((u / totalRtCountries) * 100).toFixed(1)) : 0,
        };
      });
    }

    // Top Events
    const topEvents = (realtimeEvents?.rows || []).map((row: any) => ({
      name: row.dimensionValues?.[0]?.value || "event",
      count: parseInt(row.metricValues?.[0]?.value || "0", 10),
    }));

    // Traffic Sources
    const totalSourceUsers = (realtimeSources?.rows || []).reduce(
      (acc: number, r: any) => acc + parseInt(r.metricValues?.[0]?.value || "0", 10),
      0
    );
    const trafficSources = (realtimeSources?.rows || []).map((row: any) => {
      const u = parseInt(row.metricValues?.[0]?.value || "0", 10);
      const src = row.dimensionValues?.[0]?.value || "Direct / (none)";
      return {
        source: src === "(direct)" || src === "(none)" || !src ? "Direct Traffic" : src,
        users: u,
        percentage: totalSourceUsers ? parseFloat(((u / totalSourceUsers) * 100).toFixed(1)) : 0,
      };
    });

    return NextResponse.json({
      configured: true,
      propertyId,
      data: {
        overview: {
          activeUsers,
          sessions,
          pageViews,
          avgSessionDuration,
          bounceRate: `${bounceVal}%`,
          realtimeUsers,
        },
        dailyTrends,
        topPages,
        deviceBreakdown,
        countryBreakdown,
        topEvents,
        trafficSources,
      },
    });
  } catch (error: any) {
    console.error("Google Analytics Data API Error:", error);
    return NextResponse.json({
      configured: true,
      propertyId,
      error: error?.message || "Failed to query Google Analytics Data API",
      data: {
        overview: {
          activeUsers: 0,
          sessions: 0,
          pageViews: 0,
          avgSessionDuration: "0m 0s",
          bounceRate: "0.0%",
          realtimeUsers: 0,
        },
        dailyTrends: [],
        topPages: [],
        deviceBreakdown: [],
        countryBreakdown: [],
        topEvents: [],
        trafficSources: [],
      },
    });
  }
}
