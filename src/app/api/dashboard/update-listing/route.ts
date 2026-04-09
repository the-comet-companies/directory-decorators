import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail } from '@/lib/db'
import { getProviderBySlug } from '@/lib/data'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const user = getUserByEmail(authUser.email)
    if (!user?.claimedBusinessSlug) {
      return NextResponse.json({ ok: false, error: 'No claimed business found.' }, { status: 403 })
    }

    const updates = await req.json()
    const slug = user.claimedBusinessSlug

    // Check which file the provider lives in
    const provider = getProviderBySlug(slug)
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Business not found.' }, { status: 404 })
    }

    const allowed = [
      'name', 'description', 'shortSummary', 'address', 'phone', 'email',
      'website', 'servicesOffered', 'productCategories', 'printingMethods',
      'moq', 'turnaroundDays', 'rushAvailable', 'pickup', 'delivery',
      'ecoFriendly', 'coverImage', 'galleryImages', 'logoImage',
      'bulkOrders', 'smallBatch', 'customDesign', 'onlineOrdering',
      'nationwideShipping', 'freeQuotes', 'sameDayPrinting',
    ]

    // Try main companies.json first
    const mainPath = path.join(process.cwd(), 'src', 'lib', 'companies.json')
    const mainData = JSON.parse(fs.readFileSync(mainPath, 'utf-8'))
    const mainIdx = mainData.findIndex((c: { slug?: string; id?: string }) => c.slug === slug || c.id === slug)

    if (mainIdx !== -1) {
      for (const key of allowed) {
        if (updates[key] !== undefined) mainData[mainIdx][key] = updates[key]
      }
      fs.writeFileSync(mainPath, JSON.stringify(mainData, null, 2), 'utf-8')
      return NextResponse.json({ ok: true })
    }

    // Try added-companies.json
    const addedPath = path.join(process.cwd(), 'companies', 'added-companies.json')
    if (fs.existsSync(addedPath)) {
      const addedData = JSON.parse(fs.readFileSync(addedPath, 'utf-8'))
      const addedIdx = addedData.findIndex((c: Record<string, string>) => {
        const s = `${(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(c.city || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(c.state || '').toLowerCase()}`
        return s === slug || c.id === slug
      })

      if (addedIdx !== -1) {
        for (const key of allowed) {
          if (updates[key] !== undefined) addedData[addedIdx][key] = updates[key]
        }
        fs.writeFileSync(addedPath, JSON.stringify(addedData, null, 2), 'utf-8')
        return NextResponse.json({ ok: true })
      }
    }

    return NextResponse.json({ ok: false, error: 'Could not find business in data files.' }, { status: 404 })
  } catch (err) {
    console.error('Update listing error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update listing.' }, { status: 500 })
  }
}
