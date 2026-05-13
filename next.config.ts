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
  // Força o uso do Webpack desativando o Turbopack
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
