import { baseURL } from "@/resources";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/work/internal",
          "/work/oxford-corporate-website-reskin-internal",
        ],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
