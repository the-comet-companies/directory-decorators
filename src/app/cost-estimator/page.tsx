'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'

const SERVICES = [
  { id: 'screen-printing', name: 'Screen Printing', slug: 'Screen+Printing' },
  { id: 'dtg', name: 'DTG Printing', slug: 'DTG+Printing' },
  { id: 'embroidery', name: 'Embroidery', slug: 'Embroidery' },
  { id: 'heat-transfer', name: 'Heat Transfer', slug: 'Heat+Transfer' },
  { id: 'sublimation', name: 'Sublimation', slug: 'Sublimation' },
  { id: 'dtf', name: 'DTF Printing', slug: 'DTF+Printing' },
]

const GARMENTS = [
  { id: 'tshirt', name: 'T-Shirt', modifier: 1.0 },
  { id: 'hoodie', name: 'Hoodie', modifier: 2.2 },
  { id: 'polo', name: 'Polo Shirt', modifier: 1.4 },
  { id: 'hat', name: 'Hat / Cap', modifier: 0.9 },
  { id: 'tote', name: 'Tote Bag', modifier: 0.8 },
  { id: 'jacket', name: 'Jacket', modifier: 2.5 },
  { id: 'tank', name: 'Tank Top', modifier: 0.9 },
  { id: 'longsleeve', name: 'Long Sleeve', modifier: 1.3 },
]

const QUANTITIES = [1, 6, 12, 24, 48, 72, 144, 250, 500, 1000]

// Industry average pricing per unit for a standard t-shirt
// [low, high] — prices decrease with quantity
const BASE_PRICING: Record<string, Record<string, [number, number]>> = {
  'screen-printing': {
    '1': [25, 40], '6': [18, 28], '12': [12, 20], '24': [8, 15],
    '48': [6, 12], '72': [5, 10], '144': [4, 8], '250': [3.5, 7],
    '500': [3, 6], '1000': [2.5, 5],
  },
  'dtg': {
    '1': [15, 25], '6': [14, 22], '12': [12, 20], '24': [10, 18],
    '48': [9, 16], '72': [8, 14], '144': [7, 13], '250': [6.5, 12],
    '500': [6, 11], '1000': [5.5, 10],
  },
  'embroidery': {
    '1': [15, 30], '6': [12, 22], '12': [10, 18], '24': [8, 15],
    '48': [7, 13], '72': [6, 11], '144': [5, 9], '250': [4.5, 8],
    '500': [4, 7], '1000': [3.5, 6],
  },
  'heat-transfer': {
    '1': [12, 20], '6': [10, 18], '12': [8, 15], '24': [7, 13],
    '48': [6, 11], '72': [5, 10], '144': [4.5, 9], '250': [4, 8],
    '500': [3.5, 7], '1000': [3, 6],
  },
  'sublimation': {
    '1': [18, 30], '6': [15, 25], '12': [12, 20], '24': [10, 18],
    '48': [8, 15], '72': [7, 13], '144': [6, 11], '250': [5.5, 10],
    '500': [5, 9], '1000': [4.5, 8],
  },
  'dtf': {
    '1': [10, 18], '6': [9, 16], '12': [8, 14], '24': [7, 12],
    '48': [6, 10], '72': [5, 9], '144': [4.5, 8], '250': [4, 7],
    '500': [3.5, 6.5], '1000': [3, 6],
  },
}

function getEstimate(serviceId: string, garmentModifier: number, quantity: number): { low: number; high: number } {
  const pricing = BASE_PRICING[serviceId]
  if (!pricing) return { low: 0, high: 0 }

  const qtyKey = String(quantity)
  const [baseLow, baseHigh] = pricing[qtyKey] || pricing['1000']

  return {
    low: Math.round(baseLow * garmentModifier * 100) / 100,
    high: Math.round(baseHigh * garmentModifier * 100) / 100,
  }
}

function getTip(serviceId: string): string {
  const tips: Record<string, string> = {
    'screen-printing': 'Best value at 24+ pieces. Setup costs are spread across the run, so larger orders = lower per-unit price.',
    'dtg': 'Great for small runs and one-offs. No setup fees, but per-unit cost stays relatively flat regardless of quantity.',
    'embroidery': 'Price depends heavily on stitch count. Simple logos are cheaper; complex designs with many colors cost more.',
    'heat-transfer': 'Versatile and affordable. Great for names, numbers, and specialty materials like glitter or foil.',
    'sublimation': 'Best for all-over prints on polyester. Vivid colors with no cracking or peeling. Requires white or light garments.',
    'dtf': 'Newer method with no minimum orders. Works on any fabric color. Good balance of quality and affordability.',
  }
  return tips[serviceId] || ''
}

const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

export default function CostEstimatorPage() {
  const [serviceId, setServiceId] = useState('screen-printing')
  const [garmentId, setGarmentId] = useState('tshirt')
  const [quantity, setQuantity] = useState(24)

  const garment = GARMENTS.find(g => g.id === garmentId)!
  const service = SERVICES.find(s => s.id === serviceId)!
  const estimate = getEstimate(serviceId, garment.modifier, quantity)
  const totalLow = Math.round(estimate.low * quantity * 100) / 100
  const totalHigh = Math.round(estimate.high * quantity * 100) / 100
  const tip = getTip(serviceId)

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-surface-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">
              Instant Cost Estimator
            </h1>
            <p className="text-surface-500 mt-2 max-w-xl mx-auto">
              Prices shown are industry averages and may vary based on design complexity, number of colors, ink type, and provider. Contact providers directly for an accurate quote.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Options */}
            <div className="lg:col-span-3 space-y-6">

              {/* Service Type */}
              <section className="bg-white rounded-2xl border border-surface-200 p-6">
                <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">1. Printing Method</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        serviceId === s.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-surface-600 border-surface-200 hover:border-surface-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Garment Type */}
              <section className="bg-white rounded-2xl border border-surface-200 p-6">
                <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">2. Garment Type</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GARMENTS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGarmentId(g.id)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        garmentId === g.id
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-surface-600 border-surface-200 hover:border-surface-400'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Quantity */}
              <section className="bg-white rounded-2xl border border-surface-200 p-6">
                <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-4">3. Quantity</h2>
                <div className="flex flex-wrap gap-2">
                  {QUANTITIES.map(q => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        quantity === q
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-surface-600 border-surface-200 hover:border-surface-400'
                      }`}
                    >
                      {q >= 1000 ? `${q / 1000}k` : q}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <label className="text-xs text-surface-500 font-medium">Custom:</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={quantity}
                    onChange={e => {
                      const v = parseInt(e.target.value)
                      if (v > 0 && v <= 10000) setQuantity(v)
                    }}
                    className="w-24 h-10 border border-surface-200 rounded-xl px-3 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-xs text-surface-400">pieces</span>
                </div>
              </section>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 space-y-4">
                <div className="bg-white rounded-2xl border border-surface-200 p-6">
                  <h2 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-5">Your Estimate</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Method</span>
                      <span className="font-semibold text-surface-800">{service.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Garment</span>
                      <span className="font-semibold text-surface-800">{garment.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Quantity</span>
                      <span className="font-semibold text-surface-800">{quantity} pieces</span>
                    </div>
                  </div>

                  <div className="border-t border-surface-100 pt-5">
                    <p className="text-xs text-surface-400 uppercase tracking-wide mb-1">Estimated per unit</p>
                    <p className="text-2xl font-bold text-surface-900">
                      ${estimate.low.toFixed(2)} — ${estimate.high.toFixed(2)}
                    </p>
                  </div>

                  <div className="border-t border-surface-100 pt-5 mt-5">
                    <p className="text-xs text-surface-400 uppercase tracking-wide mb-1">Estimated total</p>
                    <p className="text-3xl font-extrabold text-surface-900">
                      ${totalLow.toFixed(2)} — ${totalHigh.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Tip */}
                <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-xs text-neutral-600 leading-relaxed">{tip}</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-surface-400 leading-relaxed px-1">
                  Prices shown are industry averages and may vary based on design complexity, number of colors, ink type, and provider. Contact providers directly for an accurate quote.
                </p>

                {/* CTA */}
                <a
                  href={`/?serviceType=${service.slug}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold py-3.5 transition-colors"
                >
                  Find {service.name} Providers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
