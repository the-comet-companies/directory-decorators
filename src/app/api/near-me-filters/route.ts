import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Cache filter options for 1 hour — they rarely change
export const revalidate = 3600

export async function GET() {
  // Only fetch the columns we need (much smaller payload)
  const PAGE_SIZE = 1000
  let from = 0
  const allRows: Array<{
    state: string | null
    city: string | null
    services_offered: string[] | null
    product_categories: string[] | null
    printing_methods: string[] | null
  }> = []

  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('state, city, services_offered, product_categories, printing_methods')
      .range(from, from + PAGE_SIZE - 1)
    if (error || !data || data.length === 0) break
    allRows.push(...data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  const services = new Set<string>()
  const products = new Set<string>()
  const methods = new Set<string>()
  const stateCities: Record<string, Set<string>> = {}

  for (const p of allRows) {
    for (const s of (p.services_offered || [])) if (s) services.add(s)
    for (const c of (p.product_categories || [])) if (c) products.add(c)
    for (const m of (p.printing_methods || [])) if (m) methods.add(m)

    if (p.state && p.city) {
      if (!stateCities[p.state]) stateCities[p.state] = new Set()
      stateCities[p.state].add(p.city)
    }
  }

  const stateCitiesObj: Record<string, string[]> = {}
  for (const [st, cities] of Object.entries(stateCities)) {
    stateCitiesObj[st] = [...cities].sort()
  }

  return NextResponse.json(
    {
      services: [...services].sort(),
      products: [...products].sort(),
      methods: [...methods].sort(),
      stateCities: stateCitiesObj,
    },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  )
}
