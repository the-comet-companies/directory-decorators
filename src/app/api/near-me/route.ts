import { NextRequest, NextResponse } from 'next/server'
import { getAllProviders } from '@/lib/data'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const n = parseFloat(params.get('n') || '90')
  const s = parseFloat(params.get('s') || '-90')
  const e = parseFloat(params.get('e') || '180')
  const w = parseFloat(params.get('w') || '-180')
  const limit = Math.min(parseInt(params.get('limit') || '200'), 500)

  const all = await getAllProviders()

  const filtered = all.filter(p => {
    const lat = p.coordinates?.lat
    const lng = p.coordinates?.lng
    if (!lat || !lng) return false
    return lat >= s && lat <= n && lng >= w && lng <= e
  })

  // Sort by rating * log(reviewCount) for best results first
  filtered.sort((a, b) => {
    const scoreA = a.rating * Math.log((a.reviewCount || 0) + 1)
    const scoreB = b.rating * Math.log((b.reviewCount || 0) + 1)
    return scoreB - scoreA
  })

  const results = filtered.slice(0, limit).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    address: p.address || '',
    city: p.city || '',
    serviceArea: p.serviceArea || [],
    coordinates: p.coordinates,
    coverImage: p.coverImage || '',
    rating: p.rating,
    reviewCount: p.reviewCount,
    printingMethods: p.printingMethods || [],
    productCategories: p.productCategories || [],
    servicesOffered: p.servicesOffered || [],
    startingPrice: p.startingPrice,
    moq: p.moq,
    turnaroundDays: p.turnaroundDays,
    rushAvailable: p.rushAvailable,
    pickup: p.pickup,
    delivery: p.delivery,
    ecoFriendly: p.ecoFriendly,
    featured: p.featured,
  }))

  return NextResponse.json({ companies: results, total: filtered.length })
}
