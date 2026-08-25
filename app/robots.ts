import type { MetadataRoute } from 'next'
import { APP_CONFIG } from './utils/constants'

// 静的エクスポート（output: 'export'）でも out/robots.txt として書き出される
// （以前は public/robots.txt に静的ファイルを置いていたが、
//  ドメインを APP_CONFIG.url の1か所で管理するため maternity 側と同じ方式へ寄せた）
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
  }
}
