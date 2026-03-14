import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://0p4uz5pl9f.ufs.sh/f/**")],
  },
};

export default nextConfig;
