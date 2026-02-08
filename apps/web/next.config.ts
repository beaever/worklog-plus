import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@worklog-plus/ui',
    '@worklog-plus/hooks',
    '@worklog-plus/store',
    '@worklog-plus/api',
    '@worklog-plus/types',
  ],
};

export default nextConfig;
