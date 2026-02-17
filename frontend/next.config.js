/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow API requests to backend
  async rewrites() {
    return {
      beforeFiles: [
        // Proxy API calls to backend if needed
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/api/:path*`,
        },
      ],
    }
  },
  // Enable compression
  compress: true,
  // Generate ETags
  generateEtags: true,
}

module.exports = nextConfig
