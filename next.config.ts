import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  typedRoutes: true,
};

export default nextConfig;
