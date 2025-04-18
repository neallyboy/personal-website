/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: false, // Disable CSS optimization
  },
  webpack: (config: import('webpack').Configuration) => {
    config.cache = false; // Disable webpack caching
    return config;
  },
};

export default nextConfig;
