/** @type {import('next').NextConfig} */

var nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    reactDevOverlay: false,
  },
};

module.exports = nextConfig;
