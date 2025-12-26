/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@aws-sdk/client-s3",
      "@aws-sdk/client-bedrock-runtime",
      "@aws-sdk/client-cognito-identity-provider",
    ],
  },
  images: {
    domains: [
      process.env.S3_BUCKET_NAME && `${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`,
    ].filter(Boolean),
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
