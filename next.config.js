/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "aifwms.xyz", port: "", pathname: "/**" },
      { protocol: "https", hostname: "www.aifwms.xyz", port: "", pathname: "/**" },
      { protocol: "https", hostname: "vercel-blob.com", port: "", pathname: "/**" },
    ],
  },
  compress: true,
  typescript: { ignoreBuildErrors: true },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  cacheMaxMemorySize: 0,
  // Mark native-adjacent packages as external in the server build so Turbopack
  // does not try to bundle @valkey/valkey-glide's compiled .node binary.
  // bullmq pulls in @valkey/valkey-glide internally; both are resolved at
  // runtime via Node's require() and are present in the standalone output.
  serverExternalPackages: ["bullmq", "@valkey/valkey-glide"],
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: true,
    workerThreads: false,
    webpackBuildWorker: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
