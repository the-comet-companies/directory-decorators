import { NextRequest, NextResponse } from 'next/server'
import { compare, hash } from 'bcryptjs'
import { getAuthUser } from '@/lib/auth'
import { getUserByEmail, updateUser } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req)
    if (!authUser) {
      return NextResponse.json({ ok: false, error: 'Not authenticated.' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ ok: false, error: 'Both fields are required.' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ ok: false, error: 'New password must be at least 6 characters.' }, { status: 400 })
    }

    const user = getUserByEmail(authUser.email)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 404 })
    }

    const match = await compare(currentPassword, user.passwordHash)
    if (!match) {
      return NextResponse.json({ ok: false, error: 'Current password is incorrect.' }, { status: 403 })
    }

    const newHash = await hash(newPassword, 10)
    updateUser(user.id, { passwordHash: newHash })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to change password.' }, { status: 500 })
  }
}
