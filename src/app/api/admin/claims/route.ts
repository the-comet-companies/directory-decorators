import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getClaims, updateClaim } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const claims = getClaims()
    return NextResponse.json({ ok: true, claims })
  } catch (err) {
    console.error('Admin claims error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load claims.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { claimId, action } = await req.json()
    if (!claimId || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const updated = updateClaim(claimId, { status: action })
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Claim not found.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, claim: updated })
  } catch (err) {
    console.error('Admin claim update error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update claim.' }, { status: 500 })
  }
}
