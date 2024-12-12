/** @type {import('next/dist/server/config').NextConfig} */
const nextConfig = {
  images: {
    domains: ["turant-news-bucket.s3.ap-south-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
