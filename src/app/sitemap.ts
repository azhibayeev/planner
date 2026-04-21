import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://myplaner.asia', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://myplaner.asia/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://myplaner.asia/offer', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]
}
