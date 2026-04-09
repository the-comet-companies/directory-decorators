import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function getAuthUser(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.email) return null
  return {
    email: token.email as string,
    role: (token.role as string) || 'owner',
    id: (token.id as string) || '',
  }
}
