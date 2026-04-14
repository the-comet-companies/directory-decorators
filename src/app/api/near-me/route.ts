import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const n = parseFloat(params.get('n') || '90')
  const s = parseFloat(params.get('s') || '-90')
  const e = parseFloat(params.get('e') || '180')
  const w = parseFloat(params.get('w') || '-180')
  const limit = Math.min(parseInt(params.get('limit') || '200'), 500)

  // Query Supabase directly with bounds filter (single fast query)
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, slug, address, city, state, service_area, lat, lng, cover_image, rating, review_count, printing_methods, product_categories, services_offered, starting_price, moq, turnaround_days, rush_available, pickup, delivery, eco_friendly, featured')
    .gte('lat', s)
    .lte('lat', n)
    .gte('lng', w)
    .lte('lng', e)
    .gt('lat', 0)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error || !data) {
    return NextResponse.json({ companies: [], total: 0 })
  }

  const results = data.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    address: p.address || '',
    city: p.city || '',
    serviceArea: p.service_area || [],
    coordinates: { lat: p.lat, lng: p.lng },
    coverImage: p.cover_image || '',
    rating: p.rating,
    reviewCount: p.review_count,
    printingMethods: p.printing_methods || [],
    productCategories: p.product_categories || [],
    servicesOffered: p.services_offered || [],
    startingPrice: p.starting_price,
    moq: p.moq,
    turnaroundDays: p.turnaround_days,
    rushAvailable: p.rush_available,
    pickup: p.pickup,
    delivery: p.delivery,
    ecoFriendly: p.eco_friendly,
    featured: p.featured,
  }))

  return NextResponse.json({ companies: results, total: results.length })
}
