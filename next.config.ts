import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // ✅ Reactの厳密モードをON
  compiler: {
    emotion: true, // ✅ MUI の `emotion` を Next.js に統合
  },
};

export default nextConfig;
