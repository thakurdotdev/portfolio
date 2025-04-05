/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dr7lkelwl/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
