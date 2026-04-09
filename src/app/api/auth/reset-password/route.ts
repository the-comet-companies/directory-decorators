import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { getUsers, updateUser } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json()

    if (!token || !email || !password) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const users = getUsers()
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      (u as unknown as Record<string, unknown>).resetToken === token
    )

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired reset link.' }, { status: 400 })
    }

    // Check expiration
    const expires = (user as unknown as Record<string, unknown>).resetTokenExpires as string
    if (!expires || new Date() > new Date(expires)) {
      return NextResponse.json({ ok: false, error: 'Reset link has expired. Please request a new one.' }, { status: 410 })
    }

    // Update password and clear token
    const newHash = await hash(password, 10)
    updateUser(user.id, {
      passwordHash: newHash,
      resetToken: '',
      resetTokenExpires: '',
    } as Partial<typeof user>)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to reset password.' }, { status: 500 })
  }
}
