/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare（Workers 静的アセット / Pages）へ配信するため静的HTMLを書き出す
  // ビルド成果物は out/ に出力される
  output: 'export',

  // 静的エクスポートでは Next.js の画像最適化サーバーが使えないため無効化
  images: {
    unoptimized: true,
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

  // キャッシュ制御は静的エクスポートでは headers() が無効になるため
  // public/_headers（Cloudflare 側で解釈される）に移動しました
}

module.exports = nextConfig
