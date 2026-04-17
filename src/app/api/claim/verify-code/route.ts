import { NextRequest, NextResponse } from 'next/server'
import { getClaims, updateClaim, getUserByEmail, createUser, updateUser } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { slug, email, code, password } = await req.json()

    if (!slug || !email || !code || !password) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // Find the most recent pending claim for this slug + email
    const claims = await getClaims()
    const claim = claims
      .filter(c => c.businessSlug === slug && c.userEmail.toLowerCase() === email.toLowerCase() && c.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    if (!claim) {
      return NextResponse.json({ ok: false, error: 'No pending claim found. Please request a new code.' }, { status: 404 })
    }

    // Check expiration
    if (new Date() > new Date(claim.codeExpiresAt)) {
      return NextResponse.json({ ok: false, error: 'Verification code has expired. Please request a new one.' }, { status: 410 })
    }

    // Check code
    if (claim.verificationCode !== code) {
      return NextResponse.json({ ok: false, error: 'Invalid verification code.' }, { status: 403 })
    }

    // Mark claim as approved
    await updateClaim(claim.id, { verified: true, status: 'approved' })

    // Auto-feature the claimed business — verified owners get priority placement
    await supabase.from('companies').update({ featured: true }).eq('slug', slug)

    // Create or update user account
    let user = await getUserByEmail(email)
    if (!user) {
      user = await createUser(email, claim.userName, password)
    }
    await updateUser(user.id, { claimedBusinessSlug: slug })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Verify code error:', err)
    return NextResponse.json({ ok: false, error: 'Verification failed.' }, { status: 500 })
  }
}
