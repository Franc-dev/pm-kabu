/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '*',
        port: '',
        pathname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Prevent canvas from being included in the bundle
    config.resolve.alias.canvas = false;
    
    return config;
  }
};

export default nextConfig;
