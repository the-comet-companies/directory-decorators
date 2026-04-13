import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getUserByEmail } from '@/lib/db'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Check admin
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 'admin', email: process.env.ADMIN_EMAIL, name: 'Admin', role: 'admin' }
        }

        // Check regular users
        const user = await getUserByEmail(credentials.email)
        if (!user) return null

        const passwordMatch = await compare(credentials.password, user.passwordHash)
        if (!passwordMatch) return null

        return { id: user.id, email: user.email, name: user.name, role: 'owner' }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role: string }).role = token.role as string
        ;(session.user as unknown as { id: string }).id = token.id as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
