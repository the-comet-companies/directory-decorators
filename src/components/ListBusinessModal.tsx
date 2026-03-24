'use client'

import { useState, useEffect } from 'react'

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

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ListBusinessModal() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [methods, setMethods] = useState<string[]>([])
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

  // lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const toggleMethod = (m: string) =>
    setMethods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setStatus(data.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'w-full h-11 border border-surface-200 rounded-xl px-4 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white'
  const selectCls = 'w-full h-11 border border-surface-200 rounded-xl px-4 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white appearance-none'

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setStatus('idle') }}
        className="hidden sm:inline-flex items-center rounded-full border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors focus-ring"
      >
        List Your Business
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-surface-100 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-surface-900">List Your Business</h2>
                <p className="text-sm text-surface-500 mt-0.5">Fill in your details to get listed on Print Services Hub USA</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors text-surface-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Success state */}
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">Submission Received!</h3>
                <p className="text-sm text-surface-500 max-w-sm">Your business has been submitted for review. We'll get back to you shortly.</p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-6 space-y-6">

                {/* Business info */}
                <div>
                  <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-3">Business Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Business Name <span className="text-rose-500">*</span></label>
                      <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. DTLA Print" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(213) 555-0100" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Email</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="hello@yourbiz.com" className={inputCls}/>
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Website</label>
                      <input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbiz.com" className={inputCls}/>
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
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
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-3">Location</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Street Address <span className="text-rose-500">*</span></label>
                      <input required value={form.address} onChange={e => set('address', e.target.value)} placeholder="1234 Main St" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">City <span className="text-rose-500">*</span></label>
                      <input required value={form.city} onChange={e => set('city', e.target.value)} placeholder="Los Angeles" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">State <span className="text-rose-500">*</span></label>
                      <select required value={form.state} onChange={e => set('state', e.target.value)} className={selectCls} style={selectStyle}>
                        <option value="">Select State</option>
                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">ZIP Code</label>
                      <input value={form.zipCode} onChange={e => set('zipCode', e.target.value)} placeholder="90001" maxLength={10} className={inputCls}/>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-3">Printing Methods</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRINTING_METHODS.map(m => (
                      <label
                        key={m}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-colors select-none
                          ${methods.includes(m)
                            ? 'bg-brand-50 border-brand-400 text-brand-700'
                            : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50'}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={methods.includes(m)}
                          onChange={() => toggleMethod(m)}
                        />
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
                </div>

                {/* Pricing & details */}
                <div>
                  <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-3">Pricing & Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Starting Price ($)</label>
                      <input type="number" min="0" value={form.startingPrice} onChange={e => set('startingPrice', e.target.value)} placeholder="e.g. 50" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Min. Order (pieces)</label>
                      <input type="number" min="0" value={form.moq} onChange={e => set('moq', e.target.value)} placeholder="e.g. 12" className={inputCls}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-surface-700">Turnaround (days)</label>
                      <input type="number" min="0" value={form.turnaroundDays} onChange={e => set('turnaroundDays', e.target.value)} placeholder="e.g. 7" className={inputCls}/>
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
                </div>

                {/* Cover image */}
                <div>
                  <h3 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-3">Cover Image</h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-surface-700">Cover Image URL</label>
                    <input type="url" value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://yourbiz.com/images/cover.jpg" className={inputCls}/>
                  </div>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <p className="text-sm text-rose-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-2 pb-1 border-t border-surface-100">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
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
            )}
          </div>
        </div>
      )}
    </>
  )
}
