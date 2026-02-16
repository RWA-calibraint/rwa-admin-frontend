import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-alpha-sig.figma.com',
        port: '',
        pathname: '/img/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'rwa-test.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/uploads/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'rwa-test.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/uploads/*',
        search: '',
      },
    ],
  },
};

export default nextConfig;
