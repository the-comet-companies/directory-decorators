'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PRINTING_METHODS = [
  'Screen Printing', 'DTG Printing', 'Embroidery', 'Heat Transfer',
  'Sublimation', 'DTF Printing', 'Promotional Products', 'Custom Apparel',
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

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

const selectStyle = {
  backgroundImage: CHEVRON_SVG,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 12px center',
  backgroundSize: '16px',
  paddingRight: '36px',
}

type Status = 'idle' | 'loading' | 'error'

type Errors = Partial<Record<string, string>>

function Toast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl shadow-xl px-5 py-4 animate-in slide-in-from-top-2 max-w-sm">
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-surface-900">Business Submitted!</p>
        <p className="text-xs text-surface-500 mt-0.5">We&apos;ll review your listing and get back to you shortly.</p>
      </div>
      <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors mt-0.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}

export default function ListBusinessPage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [methods, setMethods] = useState<string[]>([])
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    coverImage: '',
    startingPrice: '',
    moq: '',
    turnaroundDays: '',
    rushAvailable: false,
    pickup: false,
    delivery: false,
  })

  const validate = (f: typeof form): Errors => {
    const e: Errors = {}
    if (!f.name.trim()) e.name = 'Business name is required.'
    if (!f.address.trim()) e.address = 'Street address is required.'
    if (!f.city.trim()) e.city = 'City is required.'
    if (!f.state) e.state = 'Please select a state.'
    return e
  }

  const set = (k: string, v: string | boolean) => {
    const updated = { ...form, [k]: v }
    setForm(updated)
    if (touched[k]) {
      const e = validate(updated)
      setErrors(prev => ({ ...prev, [k]: e[k] }))
    }
  }

  const blur = (k: string) => {
    setTouched(prev => ({ ...prev, [k]: true }))
    const e = validate(form)
    setErrors(prev => ({ ...prev, [k]: e[k] }))
  }

  const toggleMethod = (m: string) =>
    setMethods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mark all required fields as touched and validate
    const allTouched = { name: true, address: true, city: true, state: true }
    setTouched(prev => ({ ...prev, ...allTouched }))
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/list-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          printingMethods: methods,
          startingPrice: form.startingPrice ? Number(form.startingPrice) : null,
          moq: form.moq ? Number(form.moq) : null,
          turnaroundDays: form.turnaroundDays ? Number(form.turnaroundDays) : null,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('idle')
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
          router.push('/')
        }, 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls = (field: string) =>
    `w-full h-11 border rounded-xl px-4 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 bg-white transition-colors ${
      errors[field]
        ? 'border-rose-400 focus:ring-rose-400'
        : 'border-surface-200 focus:ring-brand-500'
    }`

  const selectCls = (field: string) =>
    `w-full h-11 border rounded-xl px-4 text-sm text-surface-700 focus:outline-none focus:ring-2 bg-white appearance-none transition-colors ${
      errors[field]
        ? 'border-rose-400 focus:ring-rose-400'
        : 'border-surface-200 focus:ring-brand-500'
    }`

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-rose-500 flex items-center gap-1 mt-0.5">
        <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        {errors[field]}
      </p>
    ) : null

  return (
    <>
      {showToast && <Toast onClose={() => setShowToast(false)} />}

      <div className="min-h-[calc(100vh-64px)] bg-surface-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">List Your Business</h1>
            <p className="text-surface-500 mt-1.5">Fill in your details to get listed on Print Services Hub USA</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* Business Info */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Business Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Business Name <span className="text-rose-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => blur('name')}
                    placeholder="e.g. DTLA Print"
                    className={inputCls('name')}
                  />
                  <FieldError field="name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(213) 555-0100" className={inputCls('phone')}/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="hello@yourbiz.com" className={inputCls('email')}/>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Website</label>
                  <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbiz.com" className={inputCls('website')}/>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="Tell customers what makes your shop special..."
                    rows={3}
                    className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Street Address <span className="text-rose-500">*</span></label>
                  <input
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                    onBlur={() => blur('address')}
                    placeholder="1234 Main St"
                    className={inputCls('address')}
                  />
                  <FieldError field="address" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">City <span className="text-rose-500">*</span></label>
                  <input
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    onBlur={() => blur('city')}
                    placeholder="Los Angeles"
                    className={inputCls('city')}
                  />
                  <FieldError field="city" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">State <span className="text-rose-500">*</span></label>
                  <select
                    value={form.state}
                    onChange={e => set('state', e.target.value)}
                    onBlur={() => blur('state')}
                    className={selectCls('state')}
                    style={selectStyle}
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <FieldError field="state" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">ZIP Code</label>
                  <input value={form.zipCode} onChange={e => set('zipCode', e.target.value)} placeholder="90001" maxLength={10} className={inputCls('zipCode')}/>
                </div>
              </div>
            </section>

            {/* Printing Methods */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Printing Methods</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRINTING_METHODS.map(m => (
                  <label
                    key={m}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-colors select-none
                      ${methods.includes(m)
                        ? 'bg-brand-50 border-brand-400 text-brand-700'
                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'}`}
                  >
                    <input type="checkbox" className="sr-only" checked={methods.includes(m)} onChange={() => toggleMethod(m)}/>
                    <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${methods.includes(m) ? 'bg-brand-600 border-brand-600' : 'border-surface-300'}`}>
                      {methods.includes(m) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </span>
                    {m}
                  </label>
                ))}
              </div>
            </section>

            {/* Pricing & Details */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Pricing & Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Starting Price ($)</label>
                  <input type="number" min="0" value={form.startingPrice} onChange={e => set('startingPrice', e.target.value)} placeholder="e.g. 50" className={inputCls('startingPrice')}/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Min. Order (pieces)</label>
                  <input type="number" min="0" value={form.moq} onChange={e => set('moq', e.target.value)} placeholder="e.g. 12" className={inputCls('moq')}/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Turnaround (days)</label>
                  <input type="number" min="0" value={form.turnaroundDays} onChange={e => set('turnaroundDays', e.target.value)} placeholder="e.g. 7" className={inputCls('turnaroundDays')}/>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                {([['rushAvailable', 'Rush Available'], ['pickup', 'In-store Pickup'], ['delivery', 'Delivery']] as [string, string][]).map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={e => set(k, e.target.checked)} className="sr-only"/>
                    <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form[k as keyof typeof form] ? 'bg-brand-600 border-brand-600' : 'border-surface-300 bg-white'}`}>
                      {form[k as keyof typeof form] && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium text-surface-700">{label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Cover Image */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Cover Image</h2>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-surface-700">Cover Image URL</label>
                <input type="url" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://yourbiz.com/images/cover.jpg" className={inputCls('coverImage')}/>
              </div>
            </section>

            {/* API error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Something went wrong on our end. Please try again.
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-full border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                {status === 'loading' && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                )}
                Submit Business
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
