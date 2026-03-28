'use client'

import { useState, useEffect, useMemo } from 'react'
import Footer from '@/components/Footer'

const SERVICES_LIST = [
  'Screen Printing', 'DTG Printing', 'Embroidery', 'Heat Transfer',
  'Sublimation', 'DTF Printing', 'Custom Apparel',
]

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

type Status = 'idle' | 'loading' | 'success' | 'error'
type Step = 'select' | 'form'

interface ProviderOption {
  name: string
  slug: string
  city: string
  state: string
  rating: number
  reviewCount: number
  services: string[]
  hasEmail: boolean
}

export default function RequestQuotesPage() {
  const [step, setStep] = useState<Step>('select')
  const [status, setStatus] = useState<Status>('idle')
  const [allProviders, setAllProviders] = useState<ProviderOption[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [filterService, setFilterService] = useState('')
  const [filterState, setFilterState] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    quantity: '',
    deadline: '',
    description: '',
  })

  useEffect(() => {
    fetch('/api/all-providers')
      .then(r => r.json())
      .then(data => setAllProviders(data.providers || []))
      .catch(() => {})
  }, [])

  const states = useMemo(() => {
    const s = new Set(allProviders.map(p => p.state))
    return Array.from(s).sort()
  }, [allProviders])

  const filtered = useMemo(() => {
    return allProviders.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.city.toLowerCase().includes(search.toLowerCase())) return false
      if (filterService && !p.services.some(s => s.toLowerCase().includes(filterService.toLowerCase()))) return false
      if (filterState && p.state !== filterState) return false
      return true
    }).slice(0, 50)
  }, [allProviders, search, filterService, filterState])

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else if (next.size < 3) {
        next.add(slug)
      }
      return next
    })
  }

  const selectedProviders = allProviders.filter(p => selected.has(p.slug))

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || selected.size === 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/request-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          providerSlugs: Array.from(selected),
        }),
      })
      const data = await res.json()
      setStatus(data.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  // Success screen
  if (status === 'success') {
    return (
      <>
        <div className="min-h-[calc(100vh-64px)] bg-surface-50 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-3">Quote Requests Sent!</h1>
            <p className="text-surface-500 mb-2">
              Your request has been sent to {selectedProviders.length} provider{selectedProviders.length > 1 ? 's' : ''}:
            </p>
            <div className="space-y-1 mb-6">
              {selectedProviders.map(p => (
                <p key={p.slug} className="text-sm font-medium text-surface-700">{p.name}</p>
              ))}
            </div>
            <p className="text-xs text-surface-400 mb-6">Providers typically respond within 24-48 hours.</p>
            <a href="/" className="rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors">
              Browse More Printers
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-surface-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900">Multi Quote</h1>
            <p className="text-surface-500 mt-1.5">
              Select up to 3 providers and send them your project details in one go.
            </p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setStep('select')}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                step === 'select' ? 'bg-black text-white' : 'bg-surface-100 text-surface-500'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
              Select Providers
            </button>
            <svg className="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            <button
              onClick={() => selected.size > 0 && setStep('form')}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                step === 'form' ? 'bg-black text-white' : 'bg-surface-100 text-surface-500'
              } ${selected.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
              Project Details
            </button>
          </div>

          {/* Step 1: Select providers */}
          {step === 'select' && (
            <>
              {/* Selected bar */}
              {selected.size > 0 && (
                <div className="bg-black text-white rounded-2xl px-5 py-3 mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{selected.size} of 3 selected</p>
                    <p className="text-xs text-neutral-400">{selectedProviders.map(p => p.name).join(', ')}</p>
                  </div>
                  <button
                    onClick={() => setStep('form')}
                    className="rounded-full bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-surface-200 p-5 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or city..."
                    className="w-full h-10 border border-surface-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                  <select
                    value={filterService}
                    onChange={e => setFilterService(e.target.value)}
                    className="w-full h-10 border border-surface-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white appearance-none"
                    style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px', paddingRight: '32px' }}
                  >
                    <option value="">All Services</option>
                    {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={filterState}
                    onChange={e => setFilterState(e.target.value)}
                    className="w-full h-10 border border-surface-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white appearance-none"
                    style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px', paddingRight: '32px' }}
                  >
                    <option value="">All States</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Provider list */}
              <div className="space-y-2">
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-surface-500 text-sm">No providers match your filters.</div>
                )}
                {filtered.map(p => {
                  const isSelected = selected.has(p.slug)
                  const isFull = selected.size >= 3 && !isSelected
                  return (
                    <button
                      key={p.slug}
                      onClick={() => !isFull && toggle(p.slug)}
                      disabled={isFull}
                      className={`w-full text-left flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'border-black bg-surface-50 shadow-sm'
                          : isFull
                          ? 'border-surface-200 bg-white opacity-40 cursor-not-allowed'
                          : 'border-surface-200 bg-white hover:border-surface-400 hover:shadow-sm'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-black border-black' : 'border-surface-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>

                      {/* Logo */}
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">{p.name.charAt(0)}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-surface-900 truncate">{p.name}</p>
                          {p.hasEmail && (
                            <span className="text-[9px] font-medium bg-surface-100 text-surface-500 px-1.5 py-0.5 rounded-full shrink-0">Direct</span>
                          )}
                        </div>
                        <p className="text-xs text-surface-500">{p.city}, {p.state}</p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-xs font-semibold text-surface-700">{p.rating}</span>
                        <span className="text-[10px] text-surface-400">({p.reviewCount})</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Step 2: Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Selected providers summary */}
              <section className="bg-white rounded-2xl border border-surface-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide">Sending to ({selectedProviders.length})</h2>
                  <button type="button" onClick={() => setStep('select')} className="text-xs font-medium text-surface-500 hover:text-surface-700 transition-colors">
                    Change
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedProviders.map(p => (
                    <div key={p.slug} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{p.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-800">{p.name}</p>
                          <p className="text-[10px] text-surface-500">{p.city}, {p.state}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => { toggle(p.slug); if (selected.size <= 1) setStep('select'); }} className="text-surface-400 hover:text-surface-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Your Info */}
              <section className="bg-white rounded-2xl border border-surface-200 p-6">
                <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Your Info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Name <span className="text-red-500">*</span></label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(213) 555-0100" className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                </div>
              </section>

              {/* Project Details */}
              <section className="bg-white rounded-2xl border border-surface-200 p-6">
                <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">Project Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Service Type</label>
                    <select
                      value={form.serviceType}
                      onChange={e => set('serviceType', e.target.value)}
                      className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 bg-white appearance-none"
                      style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
                    >
                      <option value="">Select service</option>
                      {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Quantity</label>
                    <input type="number" min={1} value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 48" className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Deadline</label>
                    <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full h-11 border border-surface-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-semibold text-surface-700">Project Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                      placeholder="Describe your project — garment type, colors, design details, special requirements..."
                      rows={4}
                      className="w-full border border-surface-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                    />
                  </div>
                </div>
              </section>

              {status === 'error' && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  Something went wrong. Please try again.
                </div>
              )}

              <div className="flex items-center justify-between pb-4">
                <button type="button" onClick={() => setStep('select')} className="text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors">
                  Back
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-full bg-black hover:bg-neutral-800 disabled:opacity-50 text-white px-6 py-2.5 text-sm font-semibold transition-colors inline-flex items-center gap-2"
                >
                  {status === 'loading' && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                  )}
                  Send Quote Request{selectedProviders.length > 1 ? 's' : ''}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
