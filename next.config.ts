/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbopack which can cause chunk loading issues with some libraries
  experimental: {
    // optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime'],
  },
  
  // Optimize images - automatically serve WebP to supported browsers
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
