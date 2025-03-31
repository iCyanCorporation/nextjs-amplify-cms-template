/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  env: {
    // Add environment variables here
    NEXT_PUBLIC_S3URL: process.env.NEXT_PUBLIC_S3URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: '**.amazonaws.com',
      },
      // Add other domains as needed
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
