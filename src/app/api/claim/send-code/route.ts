import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getProviderBySlug } from '@/lib/data'
import { createClaim, getClaimBySlug } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { slug, name } = await req.json()

    if (!slug || !name) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const provider = getProviderBySlug(slug)
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Business not found.' }, { status: 404 })
    }

    // Check if already claimed
    const existingClaim = getClaimBySlug(slug)
    if (existingClaim && existingClaim.status === 'approved') {
      return NextResponse.json({ ok: false, error: 'This business has already been claimed.' }, { status: 409 })
    }

    const businessEmail = provider.email?.trim()
    if (!businessEmail) {
      return NextResponse.json({ ok: false, error: 'This business does not have an email on file. Contact us at jepoylorem@gmail.com to verify your ownership.' }, { status: 400 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min

    // Save claim
    createClaim({
      businessSlug: slug,
      businessName: provider.name,
      userEmail: businessEmail,
      userName: name,
      verificationCode: code,
      codeExpiresAt: expiresAt,
      verified: false,
      status: 'pending',
    })

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Print Services Hub" <${process.env.SMTP_USER}>`,
      to: businessEmail,
      subject: `Verification Code: ${code} — Claim ${provider.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#1e293b;margin-bottom:8px;">Verify Your Business</h2>
          <p style="color:#64748b;">Use the code below to verify your ownership of <strong>${provider.name}</strong> on Print Services Hub USA.</p>
          <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#0f172a;">${code}</span>
          </div>
          <p style="color:#64748b;font-size:13px;">This code expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <p style="color:#94a3b8;font-size:12px;">Sent from Print Services Hub USA</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true, maskedEmail: businessEmail, email: businessEmail })
  } catch (err) {
    console.error('Send code error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send verification code.' }, { status: 500 })
  }
}
