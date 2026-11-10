import type { NextConfig } from "next";

// Images are local files in public/ (docs/06-ARCHITECTURE.md §7): no remote image hosts.
// AVIF first, WebP fallback (TASK-P1).
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
