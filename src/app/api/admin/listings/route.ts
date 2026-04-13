import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { getAuthUser } from '@/lib/auth'
import { getPendingListings, updatePendingListing, updateUser, getUserByEmail, createClaim } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const listings = await getPendingListings()
    return NextResponse.json({ ok: true, listings })
  } catch (err) {
    console.error('Admin listings error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load listings.' }, { status: 500 })
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const { listingId, action } = await req.json()
    if (!listingId || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const updated = await updatePendingListing(listingId, { status: action })
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Listing not found.' }, { status: 404 })
    }

    // When approved: add to added-companies.json and link to user
    if (action === 'approved') {
      const stateAbbr: Record<string, string> = {
        'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
        'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
        'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
        'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
        'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
        'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
        'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
        'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
        'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
        'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
      }

      const abbr = stateAbbr[updated.state] || updated.state
      const slug = slugify(`${updated.businessName}-${updated.city}-${abbr}`)

      const newCompany = {
        id: slug,
        name: updated.businessName,
        city: updated.city,
        state: stateAbbr[updated.state] || updated.state,
        address: updated.address,
        email: updated.email,
        phone: updated.phone,
        website: updated.website,
        description: updated.description,
        servicesOffered: updated.servicesOffered,
        productCategories: updated.productCategories,
        printingMethods: updated.printingMethods,
        coverImage: updated.coverImage,
        galleryImages: updated.galleryImages,
        moq: updated.moq,
        turnaroundDays: updated.turnaroundDays,
        rushAvailable: updated.rushAvailable,
        pickup: updated.pickup,
        delivery: updated.delivery,
        ecoFriendly: updated.ecoFriendly,
        startingPrice: null,
      }

      // Add to added-companies.json
      const addedPath = path.join(process.cwd(), 'companies', 'added-companies.json')
      let addedData = []
      try {
        addedData = JSON.parse(fs.readFileSync(addedPath, 'utf-8'))
      } catch { /* empty */ }
      addedData.push(newCompany)
      fs.writeFileSync(addedPath, JSON.stringify(addedData, null, 2), 'utf-8')

      // Link user to business and auto-verify
      const user = await getUserByEmail(updated.userEmail)
      if (user) {
        await updateUser(user.id, { claimedBusinessSlug: slug })
      }

      // Create approved claim so it shows verified badge
      await createClaim({
        businessSlug: slug,
        businessName: updated.businessName,
        userEmail: updated.userEmail,
        userName: updated.userName,
        verificationCode: '',
        codeExpiresAt: '',
        verified: true,
        status: 'approved',
      })

      // Send approval email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      const baseUrl = process.env.NEXTAUTH_URL || 'https://directory.shoptitan.app'
      const listingUrl = `${baseUrl}/provider/${slug}`
      const loginUrl = `${baseUrl}/auth/login`

      await transporter.sendMail({
        from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
        to: updated.userEmail,
        subject: `Your business "${updated.businessName}" is now live!`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#1e293b;margin-bottom:8px;">Your Listing is Live!</h2>
            <p style="color:#64748b;">Hi ${updated.userName},</p>
            <p style="color:#64748b;">Great news! Your business <strong>${updated.businessName}</strong> has been approved and is now live on Print Services Hub USA.</p>
            <div style="margin:24px 0;">
              <a href="${listingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;">
                View Your Listing
              </a>
            </div>
            <p style="color:#64748b;font-size:13px;">You can manage your listing anytime by logging into your <a href="${loginUrl}" style="color:#0f172a;font-weight:600;">dashboard</a>.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
            <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from Print Services Hub USA</p>
          </div>
        `,
      }).catch(err => console.error('Failed to send approval email:', err))
    }

    return NextResponse.json({ ok: true, listing: updated })
  } catch (err) {
    console.error('Admin listing update error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update listing.' }, { status: 500 })
  }
}
