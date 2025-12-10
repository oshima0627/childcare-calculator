/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  // 追加のReact設定
  reactStrictMode: true,
  // パフォーマンス最適化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
  },
  // 圧縮設定
  compress: true,
  // PWA対応準備
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig