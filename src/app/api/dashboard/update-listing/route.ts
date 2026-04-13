import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail } from '@/lib/db'
import { getProviderBySlug } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const user = await getUserByEmail(authUser.email)
    if (!user?.claimedBusinessSlug) {
      return NextResponse.json({ ok: false, error: 'No claimed business found.' }, { status: 403 })
    }

    const updates = await req.json()
    const slug = user.claimedBusinessSlug

    const provider = await getProviderBySlug(slug)
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Business not found.' }, { status: 404 })
    }

    // Map camelCase updates to snake_case for Supabase
    const row: Record<string, unknown> = {}
    if (updates.name !== undefined) row.name = updates.name
    if (updates.description !== undefined) row.description = updates.description
    if (updates.shortSummary !== undefined) row.short_summary = updates.shortSummary
    if (updates.address !== undefined) row.address = updates.address
    if (updates.phone !== undefined) row.phone = updates.phone
    if (updates.email !== undefined) row.email = updates.email
    if (updates.website !== undefined) row.website = updates.website
    if (updates.servicesOffered !== undefined) row.services_offered = updates.servicesOffered
    if (updates.productCategories !== undefined) row.product_categories = updates.productCategories
    if (updates.printingMethods !== undefined) row.printing_methods = updates.printingMethods
    if (updates.moq !== undefined) row.moq = updates.moq
    if (updates.turnaroundDays !== undefined) row.turnaround_days = updates.turnaroundDays
    if (updates.rushAvailable !== undefined) row.rush_available = updates.rushAvailable
    if (updates.pickup !== undefined) row.pickup = updates.pickup
    if (updates.delivery !== undefined) row.delivery = updates.delivery
    if (updates.ecoFriendly !== undefined) row.eco_friendly = updates.ecoFriendly
    if (updates.coverImage !== undefined) row.cover_image = updates.coverImage
    if (updates.galleryImages !== undefined) row.gallery_images = updates.galleryImages
    if (updates.logoImage !== undefined) row.logo_image = updates.logoImage
    if (updates.bulkOrders !== undefined) row.bulk_orders = updates.bulkOrders
    if (updates.smallBatch !== undefined) row.small_batch = updates.smallBatch
    if (updates.customDesign !== undefined) row.custom_design = updates.customDesign
    if (updates.onlineOrdering !== undefined) row.online_ordering = updates.onlineOrdering
    if (updates.nationwideShipping !== undefined) row.nationwide_shipping = updates.nationwideShipping
    if (updates.freeQuotes !== undefined) row.free_quotes = updates.freeQuotes
    if (updates.sameDayPrinting !== undefined) row.same_day_printing = updates.sameDayPrinting

    const { error } = await supabase.from('companies').update(row).eq('slug', slug)
    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ ok: false, error: 'Failed to update.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Update listing error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update listing.' }, { status: 500 })
  }
}
