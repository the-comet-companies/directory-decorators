'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Footer from '@/components/Footer'

interface Claim {
  id: string
  businessSlug: string
  businessName: string
  userEmail: string
  userName: string
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/admin')
      return
    }
    if (status === 'authenticated') {
      if ((session?.user as { role?: string })?.role !== 'admin') {
        router.push('/dashboard')
        return
      }
      fetch('/api/admin/claims')
        .then(r => r.json())
        .then(data => {
          if (data.ok) setClaims(data.claims)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [status, session, router])

  const handleAction = async (claimId: string, action: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, action }),
    })
    const data = await res.json()
    if (data.ok) {
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action } : c))
    }
  }

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter)
  const pendingCount = claims.filter(c => c.status === 'pending').length

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Loading admin panel...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Admin Panel</h1>
            <p className="text-sm text-surface-500 mt-1">{claims.length} total claims &middot; {pendingCount} pending</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-red-600 hover:text-red-700">Sign Out</button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Claims list */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-surface-500 text-sm">No claims to show.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(claim => (
              <div key={claim.id} className="bg-white rounded-xl border border-surface-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-surface-900">{claim.businessName}</h3>
                    <p className="text-sm text-surface-500 mt-0.5">
                      Claimed by <strong>{claim.userName}</strong> ({claim.userEmail})
                    </p>
                    <p className="text-xs text-surface-400 mt-1">
                      {new Date(claim.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      {' '}&middot;{' '}
                      Email verified: {claim.verified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {claim.status === 'pending' ? (
                      <>
                        <button onClick={() => handleAction(claim.id, 'approved')}
                          className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleAction(claim.id, 'rejected')}
                          className="rounded-full border border-red-300 text-red-600 px-4 py-1.5 text-sm font-medium hover:bg-red-50 transition-colors">
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                <a href={`/provider/${claim.businessSlug}`} className="inline-block mt-2 text-xs text-brand-600 hover:underline">
                  View listing →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
