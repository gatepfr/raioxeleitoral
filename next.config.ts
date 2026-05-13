import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'divulgacandcontas.tse.jus.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
