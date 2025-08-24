import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        hostname: 'adi28zdudo.ufs.sh',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
