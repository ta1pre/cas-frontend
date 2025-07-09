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
  // HMR（Hot Module Replacement）の設定を一時的に無効化
  // webpack: (config, { dev }) => {
  //   if (dev) {
  //     config.watchOptions = {
  //       poll: 1000,
  //       aggregateTimeout: 300,
  //     };
  //   }
  //   return config;
  // },
  // 画像リモートホスト許可 (Next.js 14+ 推奨形式)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cast-media.s3.amazonaws.com',
      },
    ],
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
