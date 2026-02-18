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
      // OGP画像: 24時間キャッシュ（immutableなし、更新可能にする）
      // Threads・FacebookなどMetaクローラーが定期的に再取得できるようにする
      {
        source: '/opengraph-image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      // Next.js静的アセット（ファイル名にハッシュ含む）: 長期immutableキャッシュ
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // HTMLページ: 常に再検証
      {
        source: '/(.*)',
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