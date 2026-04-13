import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ ok: false, error: 'All fields are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ ok: false, error: 'An account with this email already exists.' }, { status: 409 })
    }

    await createUser(email, name, password)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ ok: false, error: 'Registration failed.' }, { status: 500 })
  }
}
