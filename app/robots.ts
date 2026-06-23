import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use environment variable for the base URL in production, or fallback to the standard domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://decm-vanuatu.gov.vu";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/assement", "/assement/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
