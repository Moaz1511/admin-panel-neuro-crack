import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // --- ADD THIS BLOCK ---
  // This tells Next.js to allow images from these specific domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Allows any image path from unsplash.com
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**', // Allows images from ui-avatars.com
      },
      {
        protocol: 'https',
        hostname: 'assets.neurocrack.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // --- END OF ADDED BLOCK ---

  // Allow cross-origin requests during development
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? 'http://192.168.0.101:5000'
              : process.env.NEXT_PUBLIC_API_URL || '',
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
  

  // Configure allowed origins for development mode
  allowedDevOrigins: [
    // Allow requests from your local development server
    'localhost',
    '127.0.0.1',
    // Allow requests from your backend server
    '192.168.0.101',
    '192.168.154.33', 
    'http://ai.neurocrack.com',
    'admin.neurocrack.com',
    // Allow requests with different protocols and ports
    'http://localhost:3000',
    'http://localhost:5000',
    'http://192.168.0.101:3000',
    'http://192.168.0.101:5000',
    'http://192.168.154.33:3000',
    'http://192.168.154.33:5000',
    // Allow wildcard subdomains if needed
    '*.localhost',
    '*.192.168.0.101',
    '*.192.168.154.33'
  ],
  
};

export default nextConfig;