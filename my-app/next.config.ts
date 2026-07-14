import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Your existing config options here (if any) */
  allowedDevOrigins: [
    "192.168.1.11", 
    "192.168.1.11:3000", 
    "localhost:3000"
  ]
};

export default nextConfig;