import type { Metadata } from 'next'
import NearMeWrapper from '@/components/NearMeWrapper'

export const metadata: Metadata = {
  title: 'Printing Companies Near Me — Printing Services Hub',
  description: 'Find printing companies near you. Search by city, state, or ZIP code and see results on the map.',
}

export default function NearMePage() {
  return <NearMeWrapper />
}
