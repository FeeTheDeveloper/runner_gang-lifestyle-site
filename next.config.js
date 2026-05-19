/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.printful.com"
      },
      {
        protocol: "https",
        hostname: "images.printful.com"
      },
      {
        protocol: "https",
        hostname: "cdn.printful.com"
      },
      {
        protocol: "https",
        hostname: "printful-upload.s3-accelerate.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com"
      }
    ]
  }
};

module.exports = nextConfig;

