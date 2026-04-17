import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getUserByEmail, updateUser } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required.' }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists — always show success
      return NextResponse.json({ ok: true })
    }

    // Generate reset token (valid 30 min)
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString()

    await updateUser(user.id, { resetToken: token, resetTokenExpires: expires })

    const baseUrl = process.env.NEXTAUTH_URL || 'https://directory.shoptitan.app'
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"USA Decorator Directory" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Reset Your Password — USA Decorator Directory',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;">
          <h2 style="color:#1e293b;margin-bottom:8px;">Reset Your Password</h2>
          <p style="color:#64748b;">Hi ${user.name},</p>
          <p style="color:#64748b;">We received a request to reset your password. Click the button below to set a new one.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;margin:24px 0;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px;">This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
          <p style="color:#94a3b8;font-size:12px;margin:0;">Sent from USA Decorator Directory</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to send reset email.' }, { status: 500 })
  }
}
