import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProviders } from '@/lib/data'
import { Provider } from '@/lib/types'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { fullStateName } from '@/lib/states'
import Image from 'next/image'

const BestOfFilters = dynamic(() => import('@/components/BestOfFilters'))

const SERVICES = [
  { id: 'screen-printing', name: 'Screen Printing', filter: 'Screen Printing' },
  { id: 'dtg-printing', name: 'DTG Printing', filter: 'DTG Printing' },
  { id: 'embroidery', name: 'Embroidery', filter: 'Embroidery' },
  { id: 'dtf-printing', name: 'DTF Printing', filter: 'DTF Printing' },
  { id: 'heat-transfer', name: 'Heat Transfer', filter: 'Heat Transfer' },
  { id: 'sublimation', name: 'Sublimation', filter: 'Sublimation' },
]

const TOP_CITIES = [
  { city: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca' },
  { city: 'New York', state: 'NY', slug: 'new-york-ny' },
  { city: 'Chicago', state: 'IL', slug: 'chicago-il' },
  { city: 'Houston', state: 'TX', slug: 'houston-tx' },
  { city: 'Portland', state: 'OR', slug: 'portland-or' },
  { city: 'San Francisco', state: 'CA', slug: 'san-francisco-ca' },
  { city: 'Miami', state: 'FL', slug: 'miami-fl' },
  { city: 'Denver', state: 'CO', slug: 'denver-co' },
  { city: 'Austin', state: 'TX', slug: 'austin-tx' },
  { city: 'San Diego', state: 'CA', slug: 'san-diego-ca' },
  { city: 'Boston', state: 'MA', slug: 'boston-ma' },
  { city: 'Columbus', state: 'OH', slug: 'columbus-oh' },
  { city: 'Detroit', state: 'MI', slug: 'detroit-mi' },
  { city: 'Minneapolis', state: 'MN', slug: 'minneapolis-mn' },
  { city: 'Honolulu', state: 'HI', slug: 'honolulu-hi' },
  { city: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv' },
  { city: 'Kansas City', state: 'KS', slug: 'kansas-city-ks' },
  { city: 'Hartford', state: 'CT', slug: 'hartford-ct' },
  { city: 'Manchester', state: 'NH', slug: 'manchester-nh' },
  { city: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa' },
]

function parseSlug(slug: string): { service: typeof SERVICES[0]; city: typeof TOP_CITIES[0] } | null {
  for (const service of SERVICES) {
    if (slug.startsWith(`${service.id}-in-`)) {
      const cityPart = slug.replace(`${service.id}-in-`, '')
      const city = TOP_CITIES.find(c => c.slug === cityPart)
      if (city) return { service, city }
    }
  }
  return null
}

async function getProviders(serviceName: string, city: string, state: string): Promise<Provider[]> {
  const all = await getAllProviders({ minReviews: 20 })
  return all
    .filter(p =>
      (p.servicesOffered || []).some(s => s?.toLowerCase().includes(serviceName.toLowerCase())) &&
      ((p.city || '').toLowerCase() === city.toLowerCase() ||
       (p.serviceArea?.[0] || '').toLowerCase() === city.toLowerCase()) &&
      p.serviceArea?.[1] === state
    )
    .sort((a, b) => {
      const scoreA = a.rating * Math.log(a.reviewCount + 1)
      const scoreB = b.rating * Math.log(b.reviewCount + 1)
      return scoreB - scoreA
    })
    .slice(0, 10)
}

function getIntro(serviceName: string, city: string, state: string, count: number): string {
  const intros: Record<string, string> = {
    'Screen Printing': `Looking for the best screen printing services in ${city}, ${state}? We've ranked the top ${count} shops based on customer ratings, review volume, and service quality. Screen printing remains the go-to method for bulk apparel — t-shirts, hoodies, uniforms, and event merch — delivering vibrant, durable prints at competitive prices.`,
    'DTG Printing': `Need DTG printing in ${city}, ${state}? Direct-to-garment printing is perfect for small runs, photo-quality prints, and designs with unlimited colors. Here are the top ${count} DTG shops in ${city}, ranked by ratings and reviews.`,
    'Embroidery': `Looking for custom embroidery in ${city}, ${state}? Embroidery adds a premium, professional finish to hats, polos, jackets, and uniforms. We've ranked the top ${count} embroidery shops in ${city} based on quality and customer satisfaction.`,
    'DTF Printing': `Need DTF printing in ${city}, ${state}? DTF (Direct-to-Film) transfers work on virtually any fabric with no minimums — great for small batches and multi-color designs. Here are the top ${count} DTF shops in the area.`,
    'Heat Transfer': `Looking for heat transfer printing in ${city}, ${state}? Heat transfers are versatile and affordable — perfect for names, numbers, and specialty materials like glitter and foil. Here are the top-rated shops in ${city}.`,
    'Sublimation': `Need sublimation printing in ${city}, ${state}? Sublimation delivers vivid, edge-to-edge prints on polyester and performance fabrics — ideal for sportswear, jerseys, and all-over designs. Here are the best shops in ${city}.`,
  }
  return intros[serviceName] || `Find the best ${serviceName.toLowerCase()} services in ${city}, ${state}. Here are the top-rated providers.`
}

export function generateStaticParams() {
  const params: { slug: string }[] = []
  for (const service of SERVICES) {
    for (const city of TOP_CITIES) {
      params.push({ slug: `${service.id}-in-${city.slug}` })
    }
  }
  return params
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) return {}

  const { service, city } = parsed
  const title = `Top 10 Best ${service.name} in ${city.city}, ${city.state} — Updated 2026`
  const description = `Compare the best ${service.name.toLowerCase()} companies in ${city.city}, ${city.state}. Ranked by ratings and reviews. Find top-rated local printers. Updated 2026.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://directory.shoptitan.app/best/${slug}` },
  }
}

export default async function BestOfPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseSlug(slug)
  if (!parsed) notFound()

  const { service, city } = parsed
  const providers = await getProviders(service.filter, city.city, city.state)
  const intro = getIntro(service.name, city.city, city.state, providers.length || 10)

  // Related "best of" pages for this city
  const relatedServices = SERVICES.filter(s => s.id !== service.id).slice(0, 4)

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">›</span>
          <a href={`/service/${service.id}`} className="hover:text-brand-600 transition-colors">{service.name}</a>
          <span className="mx-2">›</span>
          <span className="text-surface-800 font-medium">{city.city}, {city.state}</span>
        </nav>

        {/* Filters */}
        <BestOfFilters currentServiceId={service.id} currentCitySlug={city.slug} />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            Top 10 Best {service.name} in {city.city}, {city.state}
          </h1>
          <p className="text-surface-500 leading-relaxed">{intro}</p>
          <p className="text-xs text-surface-400 mt-3">Last updated: March 2026</p>
        </div>

        {/* Rankings */}
        {providers.length > 0 ? (
          <div className="space-y-4 mb-12">
            {providers.map((provider, i) => (
              <a
                key={provider.id}
                href={`/provider/${provider.slug}`}
                className="group flex gap-4 sm:gap-5 rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 hover:shadow-lg hover:border-surface-300 transition-all"
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black text-white font-bold text-lg shrink-0">
                  {i + 1}
                </div>

                {/* Logo */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-100 shrink-0 hidden sm:block">
                  {provider.coverImage ? (
                    <Image
                      src={provider.coverImage}
                      alt={provider.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{provider.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-surface-900 group-hover:text-brand-700 transition-colors truncate">
                      {provider.name}
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-surface-800">{provider.rating}</span>
                      <span className="text-xs text-surface-400">({provider.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-xs text-surface-500 mt-0.5">{[fullStateName(provider.serviceArea?.[1]), provider.city].filter(Boolean).join(', ')}</p>
                  <p className="text-sm text-surface-600 mt-1.5 line-clamp-2">{provider.shortSummary}</p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {provider.servicesOffered.slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
                    <span>Turnaround: {provider.turnaroundDays === 1 ? 'Same day' : `${provider.turnaroundDays} days`}</span>
                    <span>MOQ: {provider.moq === 1 ? 'None' : provider.moq}</span>
                    {provider.rushAvailable && <span className="font-medium">Rush Available</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-200 bg-white p-10 text-center mb-12">
            <p className="text-surface-500 mb-4">We don't have enough data for {service.name} in {city.city} yet.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`/service/${service.id}`} className="rounded-full bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
                Browse All {service.name} Shops
              </a>
              <a href="/near-me" className="rounded-full border border-surface-300 px-5 py-2.5 text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-colors">
                Find Near Me
              </a>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl bg-black px-6 py-10 text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-3">Need a quick price estimate?</h2>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">Use our Cost Estimator to get an instant ballpark price for your {service.name.toLowerCase()} project.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/cost-estimator" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 transition-colors">
              Cost Estimator
            </a>
            <a href="/near-me" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Find Near Me
            </a>
          </div>
        </div>

        {/* Related best-of pages */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">More printing services in {city.city}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedServices.map(s => (
              <a
                key={s.id}
                href={`/best/${s.id}-in-${city.slug}`}
                className="rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm font-medium text-surface-700 hover:border-surface-400 hover:shadow-sm transition-all"
              >
                Best {s.name} in {city.city} →
              </a>
            ))}
          </div>
        </div>

        {/* Other cities for same service */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Best {service.name} in other cities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {TOP_CITIES.filter(c => c.slug !== city.slug).slice(0, 9).map(c => (
              <a
                key={c.slug}
                href={`/best/${service.id}-in-${c.slug}`}
                className="text-sm text-surface-600 hover:text-brand-600 transition-colors py-1"
              >
                {c.city}, {c.state}
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
