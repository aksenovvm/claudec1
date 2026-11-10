import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Индекс базы знаний строится перед сборкой и должен попасть в серверную функцию чата.
  outputFileTracingIncludes: { "/api/chat": ["./.rag-index.json"] },
};

export default nextConfig;
