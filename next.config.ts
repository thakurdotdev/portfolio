import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    optimizeCss: true,
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
