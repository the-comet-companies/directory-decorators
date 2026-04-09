import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail, createPendingListing } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const user = getUserByEmail(authUser.email)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 404 })
    }

    const data = await req.json()

    if (!data.businessName || !data.city || !data.state) {
      return NextResponse.json({ ok: false, error: 'Business name, city, and state are required.' }, { status: 400 })
    }

    createPendingListing({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      businessName: data.businessName,
      description: data.description || '',
      address: data.address || '',
      city: data.city,
      state: data.state,
      phone: data.phone || '',
      email: data.email || user.email,
      website: data.website || '',
      servicesOffered: data.servicesOffered || [],
      productCategories: data.productCategories || [],
      printingMethods: data.printingMethods || [],
      moq: data.moq || 1,
      turnaroundDays: data.turnaroundDays || 7,
      rushAvailable: data.rushAvailable || false,
      pickup: data.pickup || false,
      delivery: data.delivery || false,
      ecoFriendly: data.ecoFriendly || false,
      galleryImages: data.galleryImages || [],
      coverImage: data.coverImage || '',
      status: 'pending',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Submit listing error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to submit listing.' }, { status: 500 })
  }
}
