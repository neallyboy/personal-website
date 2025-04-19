/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizeCss: false, // Disable CSS optimization
    typedRoutes: true,
  },
  webpack: (config) => {
    config.cache = false; // Disable webpack caching
    return config;
  },
};

export default nextConfig;