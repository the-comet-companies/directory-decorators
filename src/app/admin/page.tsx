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
  proofImage?: string
  message?: string
  createdAt: string
}

interface QuoteLead {
  id: string
  name: string
  email: string
  phone: string
  serviceType: string
  quantity: string
  deadline: string
  description: string
  providers: { slug: string; name: string }[]
  createdAt: string
}

interface PendingListing {
  id: string
  businessName: string
  userEmail: string
  userName: string
  city: string
  state: string
  description: string
  phone: string
  email: string
  website: string
  servicesOffered: string[]
  productCategories: string[]
  coverImage: string
  galleryImages: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

type Tab = 'claims' | 'listings' | 'leads'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [listings, setListings] = useState<PendingListing[]>([])
  const [leads, setLeads] = useState<QuoteLead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [tab, setTab] = useState<Tab>('claims')
  const [expandedListing, setExpandedListing] = useState<string | null>(null)
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null)

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
      Promise.all([
        fetch('/api/admin/claims').then(r => r.json()),
        fetch('/api/admin/listings').then(r => r.json()),
        fetch('/api/admin/leads').then(r => r.json()),
      ]).then(([claimsData, listingsData, leadsData]) => {
        if (claimsData.ok) setClaims(claimsData.claims)
        if (leadsData.ok) setLeads(leadsData.leads)
        if (listingsData.ok) {
          setListings(listingsData.listings)
          // Auto-switch to listings tab if there are pending listings but no pending claims
          const pendingL = (listingsData.listings || []).filter((l: PendingListing) => l.status === 'pending').length
          const pendingC = (claimsData.claims || []).filter((c: Claim) => c.status === 'pending').length
          if (pendingL > 0 && pendingC === 0) setTab('listings')
        }
        setLoading(false)
      }).catch(err => { console.error('Admin fetch error:', err); setLoading(false) })
    }
  }, [status, session, router])

  const handleListingAction = async (listingId: string, action: 'approved' | 'rejected') => {
    const res = await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, action }),
    })
    const data = await res.json()
    if (data.ok) {
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: action } : l))
    }
  }

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
  const filteredListings = filter === 'all' ? listings : listings.filter(l => l.status === filter)
  const pendingCount = claims.filter(c => c.status === 'pending').length
  const pendingListingsCount = listings.filter(l => l.status === 'pending').length

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
            <p className="text-sm text-surface-500 mt-1">{claims.length} claims &middot; {listings.length} listings &middot; {leads.length} leads &middot; {pendingCount + pendingListingsCount} pending</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-red-600 hover:text-red-700">Sign Out</button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('claims')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === 'claims' ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
            Claims {pendingCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>}
          </button>
          <button onClick={() => setTab('listings')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === 'listings' ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
            New Listings {pendingListingsCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingListingsCount}</span>}
          </button>
          <button onClick={() => setTab('leads')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === 'leads' ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>
            Leads {leads.length > 0 && <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">{leads.length}</span>}
          </button>
        </div>

        {/* Filter tabs (hide for leads) */}
        {tab !== 'leads' && <div className="flex gap-2 mb-6">
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
        </div>}

        {/* Claims list */}
        {tab === 'claims' && (filtered.length === 0 ? (
          <div className="text-center py-12 text-surface-500 text-sm">No claims to show.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(claim => {
              const isExpanded = expandedClaim === claim.id
              return (
              <div key={claim.id} className="bg-white rounded-xl border border-surface-200">
                {/* Header — always visible */}
                <div className="flex items-center justify-between gap-4 p-5 cursor-pointer" onClick={() => setExpandedClaim(isExpanded ? null : claim.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <svg className={`w-4 h-4 text-surface-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-surface-900 truncate">{claim.businessName}</h3>
                      <p className="text-xs text-surface-500 mt-0.5">
                        by {claim.userName} ({claim.userEmail}) &middot; {new Date(claim.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' '}&middot; Verified: {claim.verified ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {claim.status === 'pending' ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleAction(claim.id, 'approved') }}
                          className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
                          Approve
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAction(claim.id, 'rejected') }}
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

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-surface-100 pt-4">
                    {claim.message && (
                      <p className="text-sm text-surface-600 italic mb-3">&ldquo;{claim.message}&rdquo;</p>
                    )}
                    {claim.proofImage && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-surface-800 mb-1">Proof of Ownership:</p>
                        <img src={claim.proofImage} alt="Proof"
                          className="max-h-40 rounded-lg border border-surface-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;"><img src="${claim.proofImage}" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);" /></body></html>`); w.document.close() } }} />
                      </div>
                    )}
                    <a href={`/provider/${claim.businessSlug}`} className="inline-block text-xs text-brand-600 hover:underline">
                      View listing →
                    </a>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        ))}

        {/* Leads list */}
        {tab === 'leads' && (
          <div>
            {/* Download CSV button */}
            {leads.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-surface-500">{leads.length} quote request{leads.length !== 1 ? 's' : ''}</p>
                <a
                  href="/api/admin/leads?format=csv"
                  className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Download CSV
                </a>
              </div>
            )}

            {leads.length === 0 ? (
              <div className="text-center py-12 text-surface-500 text-sm">No quote leads yet.</div>
            ) : (
              <div className="space-y-3">
                {leads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-xl border border-surface-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-surface-900">{lead.name}</h3>
                        <p className="text-sm text-surface-600 mt-0.5">
                          <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">{lead.email}</a>
                          {lead.phone && <span className="ml-2 text-surface-400">{lead.phone}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-surface-400 shrink-0">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Project details */}
                    <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs text-surface-600">
                      {lead.serviceType && <div><span className="font-semibold text-surface-800">Service:</span> {lead.serviceType}</div>}
                      {lead.quantity && <div><span className="font-semibold text-surface-800">Qty:</span> {lead.quantity}</div>}
                      {lead.deadline && <div><span className="font-semibold text-surface-800">Deadline:</span> {lead.deadline}</div>}
                    </div>

                    {lead.description && (
                      <p className="mt-2 text-sm text-surface-500 bg-surface-50 rounded-lg px-3 py-2">{lead.description}</p>
                    )}

                    {/* Providers requested */}
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-surface-800 mb-1">Providers ({lead.providers.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {lead.providers.map(p => (
                          <a key={p.slug} href={`/provider/${p.slug}`} className="text-[11px] bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full hover:bg-surface-200 transition-colors">
                            {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listings list */}
        {tab === 'listings' && (filteredListings.length === 0 ? (
          <div className="text-center py-12 text-surface-500 text-sm">No listings to show.</div>
        ) : (
          <div className="space-y-3">
            {filteredListings.map(listing => {
              const isExpanded = expandedListing === listing.id
              return (
              <div key={listing.id} className="bg-white rounded-xl border border-surface-200">
                {/* Header — always visible */}
                <div className="flex items-center justify-between gap-4 p-5 cursor-pointer" onClick={() => setExpandedListing(isExpanded ? null : listing.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <svg className={`w-4 h-4 text-surface-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-surface-900 truncate">{listing.businessName}</h3>
                      <p className="text-xs text-surface-500 mt-0.5">
                        {listing.city}, {listing.state} &middot; by {listing.userName} &middot; {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {listing.status === 'pending' ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleListingAction(listing.id, 'approved') }}
                          className="rounded-full bg-black text-white px-4 py-1.5 text-sm font-medium hover:bg-neutral-800 transition-colors">
                          Approve
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleListingAction(listing.id, 'rejected') }}
                          className="rounded-full border border-red-300 text-red-600 px-4 py-1.5 text-sm font-medium hover:bg-red-50 transition-colors">
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        listing.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-surface-100 pt-4">
                    {/* Description */}
                    {listing.description && (
                      <p className="text-sm text-surface-600 mb-3">{listing.description}</p>
                    )}

                    {/* Contact info */}
                    <div className="grid sm:grid-cols-3 gap-2 mb-3 text-xs text-surface-600">
                      {listing.phone && <div><span className="font-semibold text-surface-800">Phone:</span> {listing.phone}</div>}
                      {listing.email && <div><span className="font-semibold text-surface-800">Email:</span> {listing.email}</div>}
                      {listing.website && <div><span className="font-semibold text-surface-800">Website:</span> {listing.website}</div>}
                    </div>

                    {/* Services */}
                    {listing.servicesOffered.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-surface-800 mb-1">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {listing.servicesOffered.map(s => (
                            <span key={s} className="text-[10px] bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products */}
                    {listing.productCategories?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-surface-800 mb-1">Products:</p>
                        <div className="flex flex-wrap gap-1">
                          {listing.productCategories.map(p => (
                            <span key={p} className="text-[10px] bg-surface-50 text-surface-500 px-2 py-0.5 rounded-full border border-surface-200">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cover Image */}
                    {listing.coverImage && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-surface-800 mb-1">Cover Image:</p>
                        <img src={listing.coverImage} alt="Cover" className="h-32 rounded-lg border border-surface-200 object-cover cursor-pointer hover:opacity-90"
                          onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;"><img src="${listing.coverImage}" style="max-width:90vw;max-height:90vh;object-fit:contain;" /></body></html>`); w.document.close() } }} />
                      </div>
                    )}

                    {/* Gallery Images */}
                    {listing.galleryImages?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-surface-800 mb-1">Product Images ({listing.galleryImages.length}):</p>
                        <div className="flex gap-2 overflow-x-auto">
                          {listing.galleryImages.map((img, i) => (
                            <img key={i} src={img} alt={`Product ${i+1}`} className="h-24 w-24 rounded-lg border border-surface-200 object-cover shrink-0 cursor-pointer hover:opacity-90"
                              onClick={() => { const w = window.open('', '_blank'); if (w) { w.document.write(`<html><body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;"><img src="${img}" style="max-width:90vw;max-height:90vh;object-fit:contain;" /></body></html>`); w.document.close() } }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              )
            })}
          </div>
        ))}
      </div>
      <Footer />
    </>
  )
}
