import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  turbopack: {},
};

export default nextConfig;
