/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbopack which can cause chunk loading issues with some libraries
  
  // Image optimization
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
