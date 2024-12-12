import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['onnxruntime-web/webgpu'] = 'onnxruntime-web/dist/webgpu.js';
    return config;
  },
  images: {
    domains: [
      'thumbnails-generator-bucket.s3.eu-north-1.amazonaws.com', // Add your S3 bucket domain here
    ],
  },
};

export default nextConfig;
