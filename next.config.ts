import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar erros de TypeScript durante build (temporário para migração)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
