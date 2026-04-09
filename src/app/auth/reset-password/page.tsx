'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirm) { setError('Please fill in both fields.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!data.ok) {
      setError(data.error)
    } else {
      setDone(true)
    }
  }

  if (!token || !email) {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-xl font-bold text-surface-900 mb-3">Invalid Reset Link</h1>
            <p className="text-sm text-surface-500 mb-6">This link is invalid or has expired.</p>
            <a href="/auth/forgot-password" className="text-sm font-semibold text-black hover:underline">Request a new reset link</a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (done) {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-surface-900 mb-2">Password Reset</h1>
              <p className="text-sm text-surface-500 mb-6">Your password has been updated. You can now sign in.</p>
              <a href="/auth/login" className="inline-flex rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
                Sign In
              </a>
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
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Set new password</h1>
            <p className="text-sm text-surface-500 mb-6">Enter your new password below.</p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Confirm Password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm new password"
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center"><p className="text-surface-500">Loading...</p></div>}>
      <ResetForm />
    </Suspense>
  )
}
