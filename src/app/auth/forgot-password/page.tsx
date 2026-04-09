'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.ok) {
      setError(data.error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-surface-900 mb-2">Check your email</h1>
              <p className="text-sm text-surface-500 mb-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
              </p>
              <a href="/auth/login" className="text-sm font-semibold text-black hover:underline">Back to Sign In</a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-surface-200 p-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Forgot password?</h1>
            <p className="text-sm text-surface-500 mb-6">Enter your email and we&apos;ll send you a reset link.</p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-sm text-surface-500 text-center mt-6">
              <a href="/auth/login" className="font-semibold text-black hover:underline">Back to Sign In</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
