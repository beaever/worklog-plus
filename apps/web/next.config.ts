import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@worklog/ui",
    "@worklog/hooks",
    "@worklog/store",
    "@worklog/api",
    "@worklog/types",
  ],
};

export default nextConfig;
