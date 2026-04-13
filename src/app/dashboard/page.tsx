'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Footer from '@/components/Footer'
import { uploadImage } from '@/lib/upload'

interface BusinessData {
  name: string
  description: string
  shortSummary: string
  address: string
  phone: string
  email: string
  website: string
  servicesOffered: string[]
  productCategories: string[]
  printingMethods: string[]
  moq: number
  turnaroundDays: number
  rushAvailable: boolean
  pickup: boolean
  delivery: boolean
  ecoFriendly: boolean
  coverImage: string
  galleryImages: string[]
  logoImage: string
  bulkOrders: boolean
  smallBatch: boolean
  customDesign: boolean
  onlineOrdering: boolean
  nationwideShipping: boolean
  freeQuotes: boolean
  sameDayPrinting: boolean
}

const SERVICE_OPTIONS = [
  'Screen Printing', 'DTG Printing', 'DTF Printing', 'Embroidery',
  'Heat Transfer', 'Sublimation', 'Custom Apparel', 'Vinyl Printing',
  'Large Format Printing', 'Signage', 'Promotional Products',
  'Engraving', 'Vehicle Wraps', 'Awards & Trophies',
]

const PRODUCT_OPTIONS = [
  'T-Shirts', 'Hoodies & Sweatshirts', 'Caps & Hats', 'Polos',
  'Tote Bags', 'Promotional Items', 'Uniforms', 'Sportswear',
  'Banners & Signs', 'Stickers & Decals', 'Custom Apparel',
]

const PRINTING_METHOD_OPTIONS = [
  'Screen Printing', 'DTG Printing', 'DTF Printing', 'Embroidery',
  'Heat Transfer', 'Sublimation', 'Vinyl Cutting', 'Pad Printing',
  'Puff Printing', 'Plastisol Printing', 'Waterbased Printing',
  'Foil Printing', 'Flocking Printing', 'High Density Printing',
]

const MAX_GALLERY_IMAGES = 4

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard')
      return
    }
    if (status === 'authenticated') {
      if ((session?.user as { role?: string })?.role === 'admin') {
        router.push('/admin')
        return
      }
      fetch('/api/dashboard/my-listing')
        .then(r => r.json())
        .then(data => {
          if (data.ok) {
            setBusiness(data.business)
            setSlug(data.slug || '')
          }
          else setError(data.error || 'Could not load your listing.')
          setLoading(false)
        })
        .catch(() => { setError('Failed to load listing.'); setLoading(false) })
    }
  }, [status, session, router])

  const handleSave = async () => {
    if (!business) return
    setSaving(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/dashboard/update-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(business),
    })
    const data = await res.json()
    setSaving(false)

    if (data.ok) {
      setToast({ message: 'Changes saved successfully!', type: 'success' })
      setTimeout(() => setToast(null), 4000)
    } else {
      setToast({ message: data.error || 'Failed to save changes.', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const toggleArrayItem = (key: 'servicesOffered' | 'productCategories' | 'printingMethods', item: string) => {
    if (!business) return
    const arr = business[key]
    const updated = arr.includes(item) ? arr.filter(s => s !== item) : [...arr, item]
    setBusiness({ ...business, [key]: updated })
  }

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file, 'gallery')
      setBusiness(prev => {
        if (!prev) return prev
        if (prev.galleryImages.length >= MAX_GALLERY_IMAGES) return prev
        return { ...prev, galleryImages: [...prev.galleryImages, url] }
      })
    } catch {
      setToast({ message: 'Failed to upload image.', type: 'error' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  const removeGalleryImage = (index: number) => {
    if (!business) return
    setBusiness({ ...business, galleryImages: business.galleryImages.filter((_, i) => i !== index) })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Loading dashboard...</p>
      </div>
    )
  }

  if (!business) {
    router.push('/dashboard/list')
    return null
  }

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-lg border ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-current opacity-50 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
            <p className="text-sm text-surface-500 mt-1">Manage your listing for <strong>{business.name}</strong></p>
          </div>
          <div className="flex items-center gap-3">
            {slug && <a href={`/provider/${slug}`} className="text-sm text-surface-500 hover:text-surface-700">View Listing</a>}
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-red-600 hover:text-red-700">Sign Out</button>
          </div>
        </div>

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>
        )}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Basic Information</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">Business Name</label>
              <input type="text" value={business.name} onChange={e => setBusiness({ ...business, name: e.target.value })}
                className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">Description</label>
              <textarea value={business.description} onChange={e => setBusiness({ ...business, description: e.target.value })}
                rows={4} className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Phone</label>
                <input type="text" value={business.phone} onChange={e => setBusiness({ ...business, phone: e.target.value })}
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Email</label>
                <input type="email" value={business.email} onChange={e => setBusiness({ ...business, email: e.target.value })}
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Website</label>
                <input type="url" value={business.website} onChange={e => setBusiness({ ...business, website: e.target.value })}
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Address</label>
                <input type="text" value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })}
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Offered */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Services Offered</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map(s => (
              <button key={s} onClick={() => toggleArrayItem('servicesOffered', s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  business.servicesOffered.includes(s) ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}>{s}</button>
            ))}
          </div>
        </section>

        {/* Product Categories */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Product Categories</h2>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_OPTIONS.map(p => (
              <button key={p} onClick={() => toggleArrayItem('productCategories', p)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  business.productCategories.includes(p) ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}>{p}</button>
            ))}
          </div>
        </section>

        {/* Printing Methods */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Printing Methods</h2>
          <div className="flex flex-wrap gap-2">
            {PRINTING_METHOD_OPTIONS.map(m => (
              <button key={m} onClick={() => toggleArrayItem('printingMethods', m)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  business.printingMethods.includes(m) ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}>{m}</button>
            ))}
          </div>
        </section>

        {/* Operations */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Operations</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">Min Order Quantity</label>
              <input type="number" min="1" value={business.moq} onChange={e => setBusiness({ ...business, moq: Math.max(1, Number(e.target.value)) })}
                className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">Turnaround (days)</label>
              <input type="number" min="1" value={business.turnaroundDays} onChange={e => setBusiness({ ...business, turnaroundDays: Math.max(1, Number(e.target.value)) })}
                className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'rushAvailable', label: 'Rush Available' },
              { key: 'pickup', label: 'Pickup' },
              { key: 'delivery', label: 'Delivery' },
              { key: 'ecoFriendly', label: 'Eco-Friendly' },
              { key: 'bulkOrders', label: 'Bulk Orders' },
              { key: 'smallBatch', label: 'Small Batch' },
              { key: 'customDesign', label: 'Custom Design' },
              { key: 'onlineOrdering', label: 'Online Ordering' },
              { key: 'nationwideShipping', label: 'Nationwide Shipping' },
              { key: 'freeQuotes', label: 'Free Quotes' },
              { key: 'sameDayPrinting', label: 'Same Day Printing' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer rounded-xl border border-surface-200 px-3 py-2.5 hover:bg-surface-50 transition-colors">
                <input type="checkbox" checked={!!(business as unknown as Record<string, unknown>)[key]}
                  onChange={e => setBusiness({ ...business, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-surface-300 accent-black" />
                <span className="text-sm text-surface-700">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Images</h2>

          {/* Gallery */}
          <div>
          {/* Cover Image */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-surface-800 uppercase tracking-wider">Cover Image</label>
            <p className="text-xs text-surface-400 mt-1 mb-3">This image appears on your business card in search results.</p>
            {business.coverImage ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-surface-100 border border-surface-200">
                <img src={business.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button onClick={() => setBusiness({ ...business, coverImage: '' })}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-surface-300 hover:border-surface-400 hover:bg-surface-50 transition-colors cursor-pointer">
                <svg className="w-8 h-8 text-surface-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span className="text-xs text-surface-500">Upload Cover Image</span>
                <span className="text-[10px] text-surface-400 mt-0.5">JPG, PNG, WebP (max 5MB)</span>
                <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) { setToast({ message: 'Image must be under 5MB.', type: 'error' }); setTimeout(() => setToast(null), 4000); return }
                    try {
                      const url = await uploadImage(file, 'covers')
                      setBusiness(prev => prev ? { ...prev, coverImage: url } : prev)
                    } catch { setToast({ message: 'Failed to upload cover image.', type: 'error' }); setTimeout(() => setToast(null), 4000) }
                  }} />
              </label>
            )}
          </div>

            <label className="text-sm font-semibold text-surface-800 uppercase tracking-wider">Sample Product Images</label>
            <p className="text-xs text-surface-400 mt-1 mb-4">Upload up to {MAX_GALLERY_IMAGES} images of your work (max 5MB each). Accepted: JPG, PNG, WebP.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: MAX_GALLERY_IMAGES }).map((_, i) => {
                const img = business.galleryImages[i]
                return (
                  <div key={i} className="relative">
                    {img ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-100 border border-surface-200">
                        <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                        <button onClick={() => removeGalleryImage(i)}
                          className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square w-full rounded-xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center gap-1.5 hover:border-surface-400 hover:bg-surface-50 transition-colors cursor-pointer"
                      >
                        <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
                        </svg>
                        <span className="text-xs text-surface-400">Add Image</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            {business.galleryImages.length < MAX_GALLERY_IMAGES && (
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { if (e.target.files?.[0]) { if (e.target.files[0].size > 5 * 1024 * 1024) { setToast({ message: 'Image must be under 5MB.', type: 'error' }); setTimeout(() => setToast(null), 4000); return } handleImageUpload(e.target.files[0]) } }} />
            )}
          </div>
        </section>

        {/* Change Password */}
        <ChangePassword onToast={setToast} />

        {/* Save */}
        <div className="flex justify-end gap-3">
          {slug && (
            <a href={`/provider/${slug}`} className="rounded-full border border-surface-300 px-6 py-3 text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-colors">
              View Listing
            </a>
          )}
          <button onClick={handleSave} disabled={saving}
            className="rounded-full bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

function ListYourBusinessForm({ session }: { session: ReturnType<typeof useSession>['data'] }) {
  const [form, setForm] = useState({
    businessName: '', description: '', address: '', city: '', state: '',
    phone: '', email: '', website: '',
    servicesOffered: [] as string[], productCategories: [] as string[], printingMethods: [] as string[],
    moq: 1, turnaroundDays: 7,
    rushAvailable: false, pickup: false, delivery: false, ecoFriendly: false,
    galleryImages: [] as string[], coverImage: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const galleryRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const toggleService = (s: string) => {
    setForm(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(s)
        ? prev.servicesOffered.filter(x => x !== s)
        : [...prev.servicesOffered, s],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.businessName || !form.city || !form.state) {
      setError('Business name, city, and state are required.')
      return
    }
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/dashboard/submit-listing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.ok) setSubmitted(true)
    else setError(data.error || 'Failed to submit.')
  }

  if (submitted) {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-3">Listing Submitted!</h1>
            <p className="text-surface-500 mb-6">
              Your business <strong>{form.businessName}</strong> has been submitted for review. We&apos;ll notify you at <strong>{session?.user?.email}</strong> once it&apos;s approved.
            </p>
            <a href="/" className="inline-flex rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Browse Printers
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900">List Your Business</h1>
          <p className="text-sm text-surface-500 mt-1">Fill in your business details. Your listing will be reviewed before going live.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Basic Information</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Business Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full rounded-xl border border-surface-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">City <span className="text-red-500">*</span></label>
                  <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">State <span className="text-red-500">*</span></label>
                  <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white appearance-none cursor-pointer">
                    <option value="">Select State</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Address</label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Phone</label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Website</label>
                  <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map(s => (
                <button key={s} type="button" onClick={() => toggleService(s)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    form.servicesOffered.includes(s) ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}>{s}</button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Images</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-surface-800">Cover Image</label>
              <p className="text-xs text-surface-400 mt-1 mb-2">Main image for your listing card.</p>
              {form.coverImage ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-surface-100 border border-surface-200">
                  <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, coverImage: '' })}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-surface-300 hover:border-surface-400 hover:bg-surface-50 transition-colors cursor-pointer">
                  <svg className="w-8 h-8 text-surface-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span className="text-xs text-surface-500">Upload Cover Image</span>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0]; if (!file) return
                    const reader = new FileReader(); reader.onload = () => setForm(prev => ({ ...prev, coverImage: reader.result as string })); reader.readAsDataURL(file)
                  }} />
                </label>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-surface-800">Sample Product Images ({form.galleryImages.length}/4)</label>
              <p className="text-xs text-surface-400 mt-1 mb-2">Upload up to 4 images of your work.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => {
                  const img = form.galleryImages[i]
                  return (
                    <div key={i}>
                      {img ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-100 border border-surface-200">
                          <img src={img} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setForm(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_,j) => j !== i) }))}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-black">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => galleryRef.current?.click()}
                          className="aspect-square w-full rounded-xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center gap-1 hover:border-surface-400 hover:bg-surface-50 transition-colors cursor-pointer">
                          <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/></svg>
                          <span className="text-xs text-surface-400">Add</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {form.galleryImages.length < 4 && (
                <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return
                  const reader = new FileReader(); reader.onload = () => setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, reader.result as string].slice(0,4) })); reader.readAsDataURL(file)
                }} />
              )}
            </div>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={submitting}
              className="rounded-full bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  )
}

function ChangePassword({ onToast }: { onToast: (t: { message: string; type: 'success' | 'error' }) => void }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = async () => {
    if (!currentPw || !newPw) { onToast({ message: 'Please fill in both fields.', type: 'error' }); setTimeout(() => onToast(null as unknown as { message: string; type: 'success' | 'error' }), 4000); return }
    if (newPw.length < 6) { onToast({ message: 'New password must be at least 6 characters.', type: 'error' }); setTimeout(() => onToast(null as unknown as { message: string; type: 'success' | 'error' }), 4000); return }

    setSaving(true)
    const res = await fetch('/api/dashboard/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    })
    const data = await res.json()
    setSaving(false)

    if (data.ok) {
      onToast({ message: 'Password changed successfully!', type: 'success' })
      setCurrentPw('')
      setNewPw('')
    } else {
      onToast({ message: data.error || 'Failed to change password.', type: 'error' })
    }
    setTimeout(() => onToast(null as unknown as { message: string; type: 'success' | 'error' }), 4000)
  }

  return (
    <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-surface-900 mb-4">Change Password</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1.5">Current Password</label>
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
            placeholder="Enter current password"
            className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1.5">New Password</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
      <button onClick={handleChange} disabled={saving}
        className="rounded-full border border-surface-300 px-6 py-2.5 text-sm font-semibold text-surface-700 hover:bg-surface-50 transition-colors disabled:opacity-50">
        {saving ? 'Changing...' : 'Change Password'}
      </button>
    </section>
  )
}
