import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  basePath: '/sahandlaser',
  assetPrefix: '/sahandlaser/',
  images: { unoptimized: true },
};

export default nextConfig;
