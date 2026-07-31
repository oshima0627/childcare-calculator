import { MetadataRoute } from 'next'
import { APP_CONFIG } from './utils/constants'

// output: 'export'（静的エクスポート）ではビルド時に sitemap.xml を生成する
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}