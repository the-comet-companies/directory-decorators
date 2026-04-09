import type { Metadata } from 'next'
import NearMeWrapper from '@/components/NearMeWrapper'

export const metadata: Metadata = {
  title: 'Printing Companies Near Me — Find Local Screen Printers on the Map',
  description: 'Find printing companies near you. Search by city, state, or ZIP code and see 15,000+ screen printing, embroidery, and DTG providers on an interactive map.',
  openGraph: {
    title: 'Printing Companies Near Me — Find Local Screen Printers',
    description: 'Search 15,000+ printing companies by location on an interactive map.',
    type: 'website',
  },
  alternates: { canonical: 'https://directory.shoptitan.app/near-me' },
}

export default function NearMePage() {
  return <NearMeWrapper />
}
