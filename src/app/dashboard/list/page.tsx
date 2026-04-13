'use client'

import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import { uploadImage } from '@/lib/upload'

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

export default function ListBusinessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/register')
    }
    if (status === 'authenticated' && session?.user?.email) {
      setForm(prev => ({ ...prev, email: prev.email || session.user?.email || '' }))
    }
  }, [status, session, router])

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
    if (!form.businessName || !form.city || !form.state || !form.phone || !form.email || !form.description || !form.address) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.servicesOffered.length === 0) {
      setError('Please select at least one service.')
      return
    }
    if (form.productCategories.length === 0) {
      setError('Please select at least one product type.')
      return
    }
    if (!form.coverImage) {
      setError('Please upload a cover image.')
      return
    }
    if (form.galleryImages.length === 0) {
      setError('Please upload at least one sample product image.')
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

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Loading...</p>
      </div>
    )
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
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">Description <span className="text-red-500">*</span></label>
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
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Address <span className="text-red-500">*</span></label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Phone <span className="text-red-500">*</span></label>
                  <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-11 rounded-xl border border-surface-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-800 mb-1.5">Email <span className="text-red-500">*</span></label>
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
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Services Offered <span className="text-red-500">*</span></h2>
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
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Product Types <span className="text-red-500">*</span></h2>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_OPTIONS.map(p => (
                <button key={p} type="button" onClick={() => setForm(prev => ({
                  ...prev,
                  productCategories: prev.productCategories.includes(p)
                    ? prev.productCategories.filter(x => x !== p)
                    : [...prev.productCategories, p],
                }))}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    form.productCategories.includes(p) ? 'bg-black text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}>{p}</button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Images</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-surface-800">Cover Image <span className="text-red-500">*</span></label>
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
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0]; if (!file) return
                    try { const url = await uploadImage(file, 'covers'); setForm(prev => ({ ...prev, coverImage: url })) } catch { alert('Failed to upload image.') }
                  }} />
                </label>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-surface-800">Sample Product Images ({form.galleryImages.length}/4) <span className="text-red-500">*</span></label>
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
                <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={async e => {
                  const file = e.target.files?.[0]; if (!file) return
                  try { const url = await uploadImage(file, 'gallery'); setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, url].slice(0,4) })) } catch { alert('Failed to upload image.') }
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
