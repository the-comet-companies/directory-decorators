'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Footer from '@/components/Footer'

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
  const logoInputRef = useRef<HTMLInputElement>(null)
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

  const handleImageUpload = async (file: File, target: 'cover' | 'logo' | 'gallery') => {
    // Convert to base64 data URL for now (will switch to cloud storage with Supabase)
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        if (target === 'cover') {
          setBusiness(prev => prev ? { ...prev, coverImage: dataUrl } : prev)
        } else if (target === 'logo') {
          setBusiness(prev => prev ? { ...prev, logoImage: dataUrl } : prev)
        } else if (target === 'gallery') {
          setBusiness(prev => {
            if (!prev) return prev
            if (prev.galleryImages.length >= MAX_GALLERY_IMAGES) return prev
            return { ...prev, galleryImages: [...prev.galleryImages, dataUrl] }
          })
        }
        resolve(dataUrl)
      }
      reader.readAsDataURL(file)
    })
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
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-surface-900 mb-3">No Claimed Business</h1>
            <p className="text-surface-500 mb-6">
              {error || 'You haven\'t claimed a business yet. Find your business and claim it to manage your listing.'}
            </p>
            <a href="/" className="rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Browse Businesses
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
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

          {/* Cover Image */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-surface-800 mb-2">Cover Image</label>
            {business.coverImage && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 bg-surface-100">
                <img src={business.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <button onClick={() => setBusiness({ ...business, coverImage: '' })}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black">X</button>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'cover') }} />
            <button onClick={() => coverInputRef.current?.click()}
              className="rounded-xl border border-dashed border-surface-300 px-4 py-2.5 text-sm text-surface-500 hover:border-surface-400 hover:text-surface-700 transition-colors w-full">
              {business.coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
            </button>
          </div>

          {/* Logo */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-surface-800 mb-2">Logo</label>
            {business.logoImage && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden mb-2 bg-surface-100">
                <img src={business.logoImage} alt="Logo" className="w-full h-full object-contain" />
                <button onClick={() => setBusiness({ ...business, logoImage: '' })}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-black">X</button>
              </div>
            )}
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'logo') }} />
            <button onClick={() => logoInputRef.current?.click()}
              className="rounded-xl border border-dashed border-surface-300 px-4 py-2.5 text-sm text-surface-500 hover:border-surface-400 hover:text-surface-700 transition-colors">
              {business.logoImage ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>

          {/* Gallery */}
          <div>
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
                onChange={e => { if (e.target.files?.[0]) { if (e.target.files[0].size > 5 * 1024 * 1024) { setToast({ message: 'Image must be under 5MB.', type: 'error' }); setTimeout(() => setToast(null), 4000); return } handleImageUpload(e.target.files[0], 'gallery') } }} />
            )}
          </div>
        </section>

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
