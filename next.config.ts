import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
  experimental: {
    optimizeCss: true,
  },
  images: {
    // A static export has no image server. Screenshots are committed already sized and in WebP.
    unoptimized: true,
  },
};

export default nextConfig;
