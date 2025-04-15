/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ✅ Reactの厳密モードをOFF
  compiler: {
    emotion: true, // ✅ MUI の `emotion` を Next.js に統合
  },
  devIndicators: {
    appIsrStatus: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // ビルド時のESLintチェックを無視
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
