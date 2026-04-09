'use client'

import { useState } from 'react'

interface Props {
  providerName: string
  providerSlug: string
  providerEmail: string
  services: string[]
  reviewCount: number
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ProviderQuoteForm({ providerName, providerSlug, providerEmail, services, reviewCount }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', serviceType: '', quantity: '', description: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/request-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          serviceType: form.serviceType,
          quantity: form.quantity,
          description: form.description,
          providerSlugs: [providerSlug],
        }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">Quote Sent!</h3>
        <p className="text-sm text-surface-500">Your request has been sent to {providerName}. They typically respond within 24-48 hours.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
      <h3 className="text-lg font-semibold text-surface-900 mb-1">Request a Quote</h3>
      <p className="text-sm text-surface-500 mb-5">Get a custom quote from {providerName}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Your Name</label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="you@company.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="(555) 000-0000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Service Needed</label>
          <select value={form.serviceType} onChange={e => set('serviceType', e.target.value)} className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all">
            <option value="">Select a service</option>
            {services.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Quantity</label>
          <input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="e.g., 100" />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-700 mb-1">Project Details</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none" placeholder="Describe your project..." />
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-full bg-black py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
        >
          {status === 'loading' && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          )}
          Send Quote Request
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-surface-100 space-y-2 text-xs text-surface-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Free, no-obligation quote
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Usually responds within 24 hours
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {reviewCount} verified reviews
        </div>
      </div>
    </div>
  )
}
