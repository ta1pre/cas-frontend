import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false, // ✅ Reactの厳密モードをON
  compiler: {
    emotion: true, // ✅ MUI の `emotion` を Next.js に統合
  },
  devIndicators: {
    appIsrStatus: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintチェックを無視
  },
};

export default nextConfig;
