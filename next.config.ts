/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbopack which can cause chunk loading issues with some libraries
  experimental: {
    // optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime'],
  },
};

export default nextConfig;
