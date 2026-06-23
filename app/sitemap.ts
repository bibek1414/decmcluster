import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for the base URL in production, or fallback to a standard domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://decm-vanuatu.gov.vu";

  const routes = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/dashboard", changeFrequency: "daily", priority: 0.9 },
    { path: "/assessments-tools", changeFrequency: "daily", priority: 0.8 },
    { path: "/response-tracking", changeFrequency: "daily", priority: 0.8 },
    { path: "/reports", changeFrequency: "weekly", priority: 0.7 },
    { path: "/sops", changeFrequency: "weekly", priority: 0.7 },
    { path: "/mapping", changeFrequency: "weekly", priority: 0.7 },
    { path: "/training", changeFrequency: "monthly", priority: 0.6 },
    { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
    { path: "/links", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: route.priority,
  }));
}
