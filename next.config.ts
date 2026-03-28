import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://0p4uz5pl9f.ufs.sh/f/**")],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
