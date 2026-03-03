/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbopack which can cause chunk loading issues with some libraries
  experimental: {
    // optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime'],
  },
  
  // Optimize images - Next.js will auto-convert to WebP/AVIF on the fly
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
