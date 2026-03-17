/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '6b7d7c74-09c0-402a-b7da-2a9ef747eb90-00-mtpjnzg0yrqp.kirk.replit.dev',
  ],
};

export default nextConfig;
