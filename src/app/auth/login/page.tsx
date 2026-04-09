'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-surface-200 p-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Sign in</h1>
            <p className="text-sm text-surface-500 mb-6">Access your business dashboard</p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-sm text-surface-500 text-center mt-6">
              Don&apos;t have an account?{' '}
              <a href="/auth/register" className="font-semibold text-black hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center"><p className="text-surface-500">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
