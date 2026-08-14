import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = staticExport ? (process.env.BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export" } : {}),
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  webpack(config) {
    config.module.rules.push({ test: /\.md$/, type: "asset/source" });
    return config;
  },
};

export default nextConfig;
