'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Footer from '@/components/Footer'
import { uploadImage } from '@/lib/upload'

type Step = 'name' | 'code' | 'request' | 'done' | 'requested'

export default function ClaimPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [step, setStep] = useState<Step>('name')
  const [reqName, setReqName] = useState('')
  const [reqEmail, setReqEmail] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [proofImage, setProofImage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [hasEmail, setHasEmail] = useState(true)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/provider-info?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.name) setBusinessName(data.name)
        if (data.email) setMaskedEmail(data.email)
        setHasEmail(!!data.hasEmail)
        setPageLoading(false)
      })
      .catch(() => setPageLoading(false))
  }, [slug])

  const handleSendCode = async () => {

    setLoading(true)
    setError('')

    const res = await fetch('/api/claim/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const data = await res.json()

    setLoading(false)

    if (!data.ok) {
      setError(data.error)
    } else {
      if (data.maskedEmail) setMaskedEmail(data.maskedEmail)
      if (data.email) setEmail(data.email)
      setStep('code')
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !password) { setError('Please fill in all fields.'); return }

    setLoading(true)
    setError('')

    const res = await fetch('/api/claim/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, email, code, password }),
    })
    const data = await res.json()

    setLoading(false)

    if (!data.ok) {
      setError(data.error)
    } else {
      await signIn('credentials', { email, password, redirect: false })
      setStep('done')
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Loading...</p>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-3">Business Claimed!</h1>
            <p className="text-surface-500 mb-6">
              You&apos;ve successfully verified and claimed <strong>{businessName}</strong>. You can now manage your listing from your dashboard.
            </p>
            <a
              href="/dashboard"
              className="inline-flex rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Go to Dashboard
            </a>
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

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`flex items-center gap-2 text-sm font-medium ${step === 'name' ? 'text-black' : 'text-surface-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'name' ? 'bg-black text-white' : 'bg-surface-200 text-surface-500'}`}>1</span>
                Your Info
              </div>
              <svg className="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
              <div className={`flex items-center gap-2 text-sm font-medium ${step === 'code' ? 'text-black' : 'text-surface-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'code' ? 'bg-black text-white' : 'bg-surface-200 text-surface-500'}`}>2</span>
                Verify Code
              </div>
            </div>

            <h1 className="text-2xl font-bold text-surface-900 mb-1">
              Claim {businessName || 'Your Business'}
            </h1>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Step 1: Enter name, show where code will be sent */}
            {step === 'name' && (
              <>
                {!hasEmail ? (
                  <div className="mt-4">
                    <p className="text-sm text-surface-500 mb-4">
                      This business does not have an email on file. Request access and our team will review your request.
                    </p>
                    <button
                      onClick={() => setStep('request')}
                      className="block w-full rounded-xl bg-black text-white text-center py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      Request Access
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-surface-500 mt-1 mb-2">
                      We&apos;ll send a verification code to the business email on file.
                    </p>
                    <div className="rounded-lg bg-surface-50 border border-surface-200 px-4 py-3 mb-6">
                      <p className="text-xs text-surface-400 mb-0.5">Verification code will be sent to:</p>
                      <p className="text-sm font-semibold text-surface-800">{maskedEmail}</p>
                    </div>
                    <button
                      onClick={handleSendCode}
                      disabled={loading}
                      className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Sending code...' : 'Send Verification Code'}
                    </button>
                  </>
                )}
              </>
            )}

            {/* Step 2: Enter code + create password */}
            {step === 'code' && (
              <>
                <p className="text-sm text-surface-500 mt-1 mb-6">
                  We sent a 6-digit code to <strong>{maskedEmail}</strong>. Enter it below and set your password.
                </p>
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Verification Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full h-12 rounded-xl border border-surface-200 px-3 text-center text-lg font-bold tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Create Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <p className="text-xs text-surface-400 mt-1">You&apos;ll use this to log in and manage your listing.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Claim Business'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep('name'); setError(''); setCode('') }}
                    className="w-full text-sm text-surface-500 hover:text-surface-700 transition-colors"
                  >
                    Resend code
                  </button>
                </form>
              </>
            )}

            {/* Request Access form (no email on file) */}
            {step === 'request' && (
              <>
                <p className="text-sm text-surface-500 mt-1 mb-6">
                  Fill in your details and we&apos;ll review your request to claim <strong>{businessName}</strong>.
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  if (!reqName || !reqEmail) { setError('Please fill in all fields.'); return }
                  if (!proofImage) { setError('Please upload proof of ownership.'); return }
                  setLoading(true)
                  setError('')
                  const res = await fetch('/api/claim/request-access', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug, name: reqName, email: reqEmail, message: reqMessage, proofImage }),
                  })
                  const data = await res.json()
                  setLoading(false)
                  if (!data.ok) { setError(data.error) } else { setStep('requested') }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Your Name</label>
                    <input type="text" value={reqName} onChange={e => setReqName(e.target.value)} placeholder="John Doe"
                      className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Your Email</label>
                    <input type="email" value={reqEmail} onChange={e => setReqEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Message (optional)</label>
                    <textarea value={reqMessage} onChange={e => setReqMessage(e.target.value)} placeholder="Tell us how you're associated with this business..."
                      rows={3} className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-800 mb-1.5">Proof of Ownership <span className="text-red-500">*</span></label>
                    <p className="text-xs text-surface-400 mb-2">Upload a screenshot of your Google Business Profile, business license, or similar document.</p>
                    {proofImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-surface-200">
                        <img src={proofImage} alt="Proof" className="w-full max-h-48 object-contain bg-surface-50" />
                        <button type="button" onClick={() => setProofImage('')}
                          className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-surface-300 hover:border-surface-400 hover:bg-surface-50 transition-colors cursor-pointer">
                        <svg className="w-8 h-8 text-surface-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-xs text-surface-500">Click to upload image</span>
                        <span className="text-[10px] text-surface-400 mt-0.5">JPG, PNG, WebP (max 5MB)</span>
                        <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return }
                            try {
                              const url = await uploadImage(file, 'proofs')
                              setProofImage(url)
                            } catch { setError('Failed to upload image.') }
                          }} />
                      </label>
                    )}
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </form>
              </>
            )}

            {/* Request submitted */}
            {step === 'requested' && (
              <div className="mt-4 text-center">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-surface-900 mb-2">Request Submitted</h2>
                <p className="text-sm text-surface-500 mb-6">
                  We&apos;ve received your request to claim <strong>{businessName}</strong>. Our team will review it and get back to you at <strong>{reqEmail}</strong>.
                </p>
                <a href="/" className="inline-flex rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
                  Back to Home
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
