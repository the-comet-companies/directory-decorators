import { NextRequest, NextResponse } from 'next/server'
import { getProviderBySlug } from '@/lib/data'

export async function GET(req: NextRequest) {
  // Single slug lookup
  const slug = req.nextUrl.searchParams.get('slug')
  if (slug) {
    const p = getProviderBySlug(slug)
    if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      name: p.name,
      slug: p.slug,
      hasEmail: !!(p.email?.trim()),
      email: p.email?.trim() || '',
    })
  }

  // Multi slug lookup
  const slugs = req.nextUrl.searchParams.get('slugs')?.split(',').filter(Boolean) || []
  const providers = slugs.map(s => {
    const p = getProviderBySlug(s)
    if (!p) return null
    return {
      name: p.name,
      slug: p.slug,
      city: `${p.city}, ${p.serviceArea?.[1] || ''}`,
      hasEmail: !!(p.email?.trim()),
    }
  }).filter(Boolean)

  return NextResponse.json({ providers })
}
