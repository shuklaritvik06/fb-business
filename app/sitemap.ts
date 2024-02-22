import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: '/',
      changeFrequency: 'weekly',
      lastModified: new Date().toISOString(),
      priority: 1.0,
    },
    {
      url: '/login',
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: '/register',
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: '/connect',
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: '/analytics',
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    {
      url: '/teams',
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
  ]
}
