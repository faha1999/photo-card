/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimizes for production deployment
  images: {
    unoptimized: false, // Enable image optimization
    remotePatterns: [], // Add any remote image domains if needed
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove console.logs in production
  },
  poweredByHeader: false, // Remove X-Powered-By header for security
  reactStrictMode: true,
};

export default nextConfig;
