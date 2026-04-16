import type { Metadata } from 'next'
import Link from 'next/link'
import NearMeWrapper from '@/components/NearMeWrapper'

export const metadata: Metadata = {
  title: 'Printing Companies Near Me - Find Local Screen Printers on the Map',
  description: 'Find printing companies near you. Search by city, state, or ZIP code and see 15,000+ screen printing, embroidery, and DTG providers on an interactive map.',
  openGraph: {
    title: 'Printing Companies Near Me - Find Local Screen Printers',
    description: 'Search 15,000+ printing companies by location on an interactive map.',
    type: 'website',
  },
  alternates: { canonical: 'https://directory.shoptitan.app/near-me' },
}

const POPULAR_CITIES = [
  { name: 'New York, NY', slug: 'new-york' },
  { name: 'Los Angeles, CA', slug: 'los-angeles' },
  { name: 'Chicago, IL', slug: 'chicago' },
  { name: 'Houston, TX', slug: 'houston' },
  { name: 'Phoenix, AZ', slug: 'phoenix' },
  { name: 'Philadelphia, PA', slug: 'philadelphia' },
  { name: 'San Antonio, TX', slug: 'san-antonio' },
  { name: 'San Diego, CA', slug: 'san-diego' },
  { name: 'Dallas, TX', slug: 'dallas' },
  { name: 'Jacksonville, FL', slug: 'jacksonville' },
]

export default function NearMePage() {
  return (
    <>
      <NearMeWrapper />
      {/* Popular cities for SEO */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 border-t border-surface-200">
        <h2 className="text-lg font-bold text-surface-900 mb-3">Popular Cities</h2>
        <p className="text-sm text-surface-600 mb-4">See the top-rated printing companies in these cities:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map(c => (
            <Link
              key={c.slug}
              href={`/near-me/${c.slug}`}
              className="inline-flex items-center rounded-full border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:border-surface-400 hover:shadow-sm transition-all"
            >
              Printing Near Me in {c.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
