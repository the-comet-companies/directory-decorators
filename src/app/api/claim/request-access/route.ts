import { NextRequest, NextResponse } from 'next/server'
import { getProviderBySlug } from '@/lib/data'
import { createClaim, getClaimBySlug } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { slug, name, email, message } = await req.json()

    if (!slug || !name || !email) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const provider = getProviderBySlug(slug)
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Business not found.' }, { status: 404 })
    }

    const existingClaim = getClaimBySlug(slug)
    if (existingClaim && existingClaim.status === 'approved') {
      return NextResponse.json({ ok: false, error: 'This business has already been claimed.' }, { status: 409 })
    }

    createClaim({
      businessSlug: slug,
      businessName: provider.name,
      userEmail: email,
      userName: name,
      verificationCode: '',
      codeExpiresAt: '',
      verified: false,
      status: 'pending',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Request access error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to submit request.' }, { status: 500 })
  }
}
