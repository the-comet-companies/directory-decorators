'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SERVICE_TYPES = [
  'Screen Printing',
  'DTG Printing',
  'Embroidery',
  'Heat Transfer',
  'Sublimation',
  'DTF Printing',
  'Promotional Products',
  'Custom Apparel',
  'Not sure — need guidance',
]

const QUANTITY_OPTIONS = [
  '1–11 pieces',
  '12–23 pieces',
  '24–47 pieces',
  '48–99 pieces',
  '100–499 pieces',
  '500+ pieces',
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
    <div className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border border-emerald-200 rounded-2xl shadow-xl px-5 py-4 max-w-sm">
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-semibold text-surface-900">Quote Request Sent!</p>
        <p className="text-xs text-surface-500 mt-0.5">We&apos;ll get back to you shortly with a quote.</p>
      </div>
      <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors mt-0.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}

export default function GetQuotePage() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    quantity: '',
    deadline: '',
    details: '',
  })

  const validate = (f: typeof form): Errors => {
    const e: Errors = {}
    if (!f.name.trim()) e.name = 'Your name is required.'
    if (!f.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.'
    if (!f.serviceType) e.serviceType = 'Please select a service type.'
    if (!f.quantity) e.quantity = 'Please select a quantity.'
    return e
  }

  const set = (k: string, v: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allTouched = { name: true, email: true, serviceType: true, quantity: true }
    setTouched(prev => ({ ...prev, ...allTouched }))
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/get-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('idle')
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
          router.push('/')
        }, 3500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls = (field: string) =>
    `w-full h-11 border rounded-xl px-4 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 bg-white transition-colors ${
      errors[field] ? 'border-rose-400 focus:ring-rose-400' : 'border-surface-200 focus:ring-brand-500'
    }`

  const selectCls = (field: string) =>
    `w-full h-11 border rounded-xl px-4 text-sm text-surface-700 focus:outline-none focus:ring-2 bg-white appearance-none transition-colors ${
      errors[field] ? 'border-rose-400 focus:ring-rose-400' : 'border-surface-200 focus:ring-brand-500'
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
            <h1 className="text-3xl font-bold text-surface-900">Get a Quote</h1>
            <p className="text-surface-500 mt-1.5">Tell us about your project and we&apos;ll get back to you with pricing.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Contact Info */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Your Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => blur('name')}
                    placeholder="Jane Smith"
                    className={inputCls('name')}
                  />
                  <FieldError field="name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    onBlur={() => blur('email')}
                    placeholder="jane@company.com"
                    className={inputCls('email')}
                  />
                  <FieldError field="email" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="(213) 555-0100"
                    className={inputCls('phone')}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Company / Brand</label>
                  <input
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    placeholder="Acme Co."
                    className={inputCls('company')}
                  />
                </div>
              </div>
            </section>

            {/* Project Details */}
            <section className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Project Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Service Type <span className="text-rose-500">*</span></label>
                  <select
                    value={form.serviceType}
                    onChange={e => set('serviceType', e.target.value)}
                    onBlur={() => blur('serviceType')}
                    className={selectCls('serviceType')}
                    style={selectStyle}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <FieldError field="serviceType" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Quantity <span className="text-rose-500">*</span></label>
                  <select
                    value={form.quantity}
                    onChange={e => set('quantity', e.target.value)}
                    onBlur={() => blur('quantity')}
                    className={selectCls('quantity')}
                    style={selectStyle}
                  >
                    <option value="">Select quantity</option>
                    {QUANTITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                  <FieldError field="quantity" />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    className={inputCls('deadline')}
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-surface-700">Project Details</label>
                  <textarea
                    value={form.details}
                    onChange={e => set('details', e.target.value)}
                    placeholder="Describe your design, colors, garment type, any special requirements..."
                    rows={4}
                    className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none"
                  />
                </div>
              </div>
            </section>

            {/* API error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Failed to send your request. Please try again.
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
                Send Quote Request
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
