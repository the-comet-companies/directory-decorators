import { NextRequest, NextResponse } from 'next/server'
import { getProviderBySlug } from '@/lib/data'

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get('slugs')?.split(',').filter(Boolean) || []

  const providers = slugs.map(slug => {
    const p = getProviderBySlug(slug)
    if (!p) return null
    return {
      name: p.name,
      slug: p.slug,
      city: `${p.city}, ${p.serviceArea[1] || ''}`,
      hasEmail: !!(p.email && p.email.trim()),
    }
  }).filter(Boolean)

  return NextResponse.json({ providers })
}
