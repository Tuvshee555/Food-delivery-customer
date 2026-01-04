import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com", // ✅ Cloudinary support
    ],
  },
};

export default nextConfig;
