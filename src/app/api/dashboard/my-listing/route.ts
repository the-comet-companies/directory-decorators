import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail } from '@/lib/db'
import { getProviderBySlug } from '@/lib/data'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const user = await getUserByEmail(authUser.email)
    if (!user?.claimedBusinessSlug) {
      return NextResponse.json({ ok: false, error: 'No claimed business.' }, { status: 404 })
    }

    const provider = getProviderBySlug(user.claimedBusinessSlug)
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Business not found.' }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      slug: provider.slug,
      business: {
        name: provider.name,
        description: provider.description,
        shortSummary: provider.shortSummary,
        address: provider.address,
        phone: provider.phone,
        email: provider.email,
        website: provider.website,
        servicesOffered: provider.servicesOffered || [],
        productCategories: provider.productCategories || [],
        printingMethods: provider.printingMethods || [],
        moq: provider.moq,
        turnaroundDays: provider.turnaroundDays,
        rushAvailable: provider.rushAvailable,
        pickup: provider.pickup,
        delivery: provider.delivery,
        ecoFriendly: provider.ecoFriendly,
        coverImage: provider.coverImage || '',
        galleryImages: provider.galleryImages || [],
        logoImage: provider.logoImage || '',
        bulkOrders: provider.bulkOrders || false,
        smallBatch: provider.smallBatch || false,
        customDesign: provider.customDesign || false,
        onlineOrdering: provider.onlineOrdering || false,
        nationwideShipping: provider.nationwideShipping || false,
        freeQuotes: provider.freeQuotes || false,
        sameDayPrinting: provider.sameDayPrinting || false,
      },
    })
  } catch (err) {
    console.error('My listing error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load listing.' }, { status: 500 })
  }
}
