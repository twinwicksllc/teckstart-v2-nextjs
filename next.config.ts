import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@aws-sdk/client-s3"],
  },
  images: {
    domains: [process.env.S3_BUCKET_NAME && `${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`].filter(Boolean) as string[],
    formats: ["image/webp", "image/avif"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;