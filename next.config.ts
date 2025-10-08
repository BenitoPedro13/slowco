import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "dcdn-us.mitiendanube.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopifycdn.net",
      },
    ],
  },
};

export default nextConfig;
