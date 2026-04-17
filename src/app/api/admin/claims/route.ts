import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getAuthUser } from '@/lib/auth'
import { getClaims, updateClaim, getUserByEmail, createUser, updateUser } from '@/lib/db'
import { supabase } from '@/lib/supabase'

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let pw = ''
  for (let i = 0; i < 10; i++) pw += chars.charAt(Math.floor(Math.random() * chars.length))
  return pw
}

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser || authUser.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
    }

    const claims = await getClaims()
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

    const updated = await updateClaim(claimId, { status: action })
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Claim not found.' }, { status: 404 })
    }

    // When approved: auto-feature the business + create account + send credentials
    if (action === 'approved' && updated.userEmail) {
      await supabase.from('companies').update({ featured: true }).eq('slug', updated.businessSlug)

      const tempPassword = generateTempPassword()

      let user = await getUserByEmail(updated.userEmail)
      if (!user) {
        user = await createUser(updated.userEmail, updated.userName, tempPassword)
      }
      await updateUser(user.id, { claimedBusinessSlug: updated.businessSlug })

      // Send credentials email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const dashboardUrl = process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/dashboard`
        : 'https://directory.shoptitan.app/dashboard'

      const loginUrl = process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL}/auth/login`
        : 'https://directory.shoptitan.app/auth/login'

      await transporter.sendMail({
        from: `"USA Decorator Directory" <${process.env.SMTP_USER}>`,
        to: updated.userEmail,
        subject: `Your business "${updated.businessName}" has been approved!`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#1e293b;margin-bottom:8px;">Business Claim Approved</h2>
            <p style="color:#64748b;">Hi ${updated.userName},</p>
            <p style="color:#64748b;">Your request to claim <strong>${updated.businessName}</strong> on USA Decorator Directory has been approved. You can now log in and manage your listing.</p>

            <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:24px 0;">
              <p style="color:#64748b;margin:0 0 12px 0;font-size:13px;">Your login credentials:</p>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;color:#64748b;width:100px;font-size:14px;">Email</td>
                  <td style="padding:6px 0;color:#0f172a;font-weight:600;font-size:14px;">${updated.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#64748b;font-size:14px;">Password</td>
                  <td style="padding:6px 0;color:#0f172a;font-weight:600;font-size:14px;font-family:monospace;letter-spacing:1px;">${tempPassword}</td>
                </tr>
              </table>
            </div>

            <a href="${loginUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;">
              Log In to Your Dashboard
            </a>

            <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
              For security, we recommend changing your password after your first login. Go to your <a href="${dashboardUrl}" style="color:#64748b;">dashboard</a> to manage your listing.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
            <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from USA Decorator Directory</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true, claim: updated })
  } catch (err) {
    console.error('Admin claim update error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update claim.' }, { status: 500 })
  }
}
