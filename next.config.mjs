import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://nealmiran.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://consent.cookiebot.com https://consentcdn.cookiebot.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://nealmiran.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://c.bing.com https://consent.cookiebot.com https://consentcdn.cookiebot.com https://fonts.gstatic.com https://maps.gstatic.com https://*.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://nealmiran.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://*.clarity.ms https://dc.services.visualstudio.com https://consent.cookiebot.com https://consentcdn.cookiebot.com https://maps.googleapis.com https://maps.gstatic.com",
      "frame-src https://nealmiran.com https://www.googletagmanager.com https://consent.cookiebot.com https://consentcdn.cookiebot.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  webpack(config) {
    // once-ui ships without "sideEffects: false" so webpack can't tree-shake it.
    // Marking it here lets webpack drop unused component code from bundles.
    config.module.rules.push({
      test: /node_modules\/@once-ui-system\/core\/dist\/.+\.js$/,
      sideEffects: false,
    });
    return config;
  },
};

export default withMDX(nextConfig);
