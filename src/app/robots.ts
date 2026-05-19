import { baseURL } from "@/resources";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/internal/",
          "/work/internal",
          "/work/oxford-corporate-website-reskin-internal",
        ],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
