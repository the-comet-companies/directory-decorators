import { NextResponse } from 'next/server'
import { getAllProviders } from '@/lib/data'

export async function GET() {
  const all = getAllProviders()

  const services = new Set<string>()
  const products = new Set<string>()
  const methods = new Set<string>()
  const stateCities: Record<string, Set<string>> = {}

  for (const p of all) {
    for (const s of (p.servicesOffered || [])) if (s) services.add(s)
    for (const c of (p.productCategories || [])) if (c) products.add(c)
    for (const m of (p.printingMethods || [])) if (m) methods.add(m)

    const sa = p.serviceArea
    if (sa && sa.length >= 2 && sa[1]) {
      const state = sa[1]
      const city = sa[0] || p.city
      if (city) {
        if (!stateCities[state]) stateCities[state] = new Set()
        stateCities[state].add(city)
      }
    }
  }

  const stateCitiesObj: Record<string, string[]> = {}
  for (const [st, cities] of Object.entries(stateCities)) {
    stateCitiesObj[st] = [...cities].sort()
  }

  return NextResponse.json({
    services: [...services].sort(),
    products: [...products].sort(),
    methods: [...methods].sort(),
    stateCities: stateCitiesObj,
  })
}
