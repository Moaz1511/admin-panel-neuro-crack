import type { NextConfig } from "next";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_AI_URL,
  process.env.NEXT_PUBLIC_ACS_QUIZ_URL,
].filter(Boolean);

const nextConfig: NextConfig = {
  /* config options here */
  // Allow cross-origin requests only for specific origins from .env
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '${ORIGIN}', // Placeholder, will be replaced at runtime
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// Custom middleware to set the correct Access-Control-Allow-Origin header at runtime
if (typeof global !== 'undefined') {
  // @ts-ignore
  global.__NEXT_ALLOWED_ORIGINS__ = allowedOrigins;
}

export default nextConfig;
