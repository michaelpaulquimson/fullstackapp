import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
  // Set custom server port if running with `next start` directly (not needed for Docker, but for local dev)
  // For Docker, ensure the container runs with: `next start -p 4000` or set PORT env var
};

export default nextConfig;
