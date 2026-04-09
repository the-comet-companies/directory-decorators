import { MetadataRoute } from 'next'
import { getAllProviderSlugs } from '@/lib/data'
import { getAllStateSlugs, getAllCitySlugs } from '@/lib/geo'

const BASE_URL = 'https://directory.shoptitan.app'

const SERVICE_SLUGS = [
  'screen-printing',
  'dtg-printing',
  'dtf-printing',
  'embroidery',
  'sublimation',
  'heat-transfer',
  'vinyl-printing',
  'large-format-printing',
  'custom-apparel',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const providerSlugs = getAllProviderSlugs()
  const stateSlugs = getAllStateSlugs()
  const citySlugs = getAllCitySlugs()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/near-me`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/list-business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/cost-estimator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
{ url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/guides/how-to-order-custom-t-shirts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guides/screen-printing-vs-dtg`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/guides/how-much-does-embroidery-cost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const statePages: MetadataRoute.Sitemap = stateSlugs.map((slug) => ({
    url: `${BASE_URL}/state/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const cityPages: MetadataRoute.Sitemap = citySlugs.map((slug) => ({
    url: `${BASE_URL}/city/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const providerPages: MetadataRoute.Sitemap = providerSlugs.map((slug) => ({
    url: `${BASE_URL}/provider/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/service/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const bestOfServices = ['screen-printing', 'dtg-printing', 'embroidery', 'dtf-printing', 'heat-transfer', 'sublimation']
  const bestOfCities = [
    'los-angeles-ca', 'new-york-ny', 'chicago-il', 'houston-tx', 'portland-or',
    'san-francisco-ca', 'miami-fl', 'denver-co', 'austin-tx', 'san-diego-ca',
    'boston-ma', 'columbus-oh', 'detroit-mi', 'minneapolis-mn', 'honolulu-hi',
    'las-vegas-nv', 'kansas-city-ks', 'hartford-ct', 'manchester-nh', 'philadelphia-pa',
  ]
  const bestOfPages: MetadataRoute.Sitemap = bestOfServices.flatMap(service =>
    bestOfCities.map(city => ({
      url: `${BASE_URL}/best/${service}-in-${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...servicePages, ...statePages, ...cityPages, ...providerPages, ...bestOfPages]
}
