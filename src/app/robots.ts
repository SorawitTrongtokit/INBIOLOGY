import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/articles"],
        disallow: ["/dashboard", "/admin", "/learn", "/update-password"],
      },
    ],
    sitemap: "https://inbiology.vercel.app/sitemap.xml",
  };
}
