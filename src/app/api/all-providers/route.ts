import { NextResponse } from 'next/server'
import { getAllProviders } from '@/lib/data'

export async function GET() {
  const all = getAllProviders()

  const providers = all.map(p => ({
    name: p.name,
    slug: p.slug,
    city: p.city,
    state: p.serviceArea[1] || '',
    rating: p.rating,
    reviewCount: p.reviewCount,
    services: p.servicesOffered,
    hasEmail: !!(p.email && p.email.trim()),
  }))

  return NextResponse.json({ providers })
}
