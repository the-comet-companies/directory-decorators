'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import companiesData from '@/lib/companies.json'

// ─── Types ──────────────────────────────────────────────────────────────────

type Company = {
  id: string
  name: string
  slug: string
  address: string
  city: string
  serviceArea: string[]
  coordinates: { lat: number; lng: number }
  coverImage: string
  rating: number
  reviewCount: number
  printingMethods: string[]
  productCategories: string[]
  servicesOffered: string[]
  startingPrice: number | null
  moq: number
  turnaroundDays: number
  rushAvailable: boolean
  pickup: boolean
  delivery: boolean
  ecoFriendly: boolean
  featured: boolean
}

type Bounds = { n: number; s: number; e: number; w: number }
type SortKey = 'rating' | 'reviews' | 'name'

const RADIUS_OPTIONS = [
  { label: '5 miles',   value: 5,   zoom: 13 },
  { label: '10 miles',  value: 10,  zoom: 12 },
  { label: '25 miles',  value: 25,  zoom: 11 },
  { label: '50 miles',  value: 50,  zoom: 10 },
  { label: '100 miles', value: 100, zoom: 9  },
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

const companies = companiesData as unknown as Company[]

// Derive unique filter values from the data
const ALL_SERVICES = [...new Set(companies.flatMap(c => c.servicesOffered))].sort()
const ALL_PRODUCT_CATS = [...new Set(companies.flatMap(c => c.productCategories))].sort()
const ALL_PRINTING_METHODS = [...new Set(companies.flatMap(c => c.printingMethods))].sort()

const MOQ_OPTIONS = [
  { label: 'No minimum', value: '1' },
  { label: '12 or fewer', value: '12' },
  { label: '24 or fewer', value: '24' },
  { label: '48 or fewer', value: '48' },
]

const TURNAROUND_OPTIONS = [
  { label: '3 days or less', value: '3' },
  { label: '5 days or less', value: '5' },
  { label: '7 days or less', value: '7' },
  { label: '14 days or less', value: '14' },
]

const RATING_OPTIONS = [
  { label: '4.5+', value: '4.5' },
  { label: '4.0+', value: '4' },
  { label: '3.5+', value: '3.5' },
]

type NearMeFilters = {
  serviceType: string[]
  printingMethod: string[]
  productType: string[]
  rushAvailable: boolean
  moq: string
  turnaround: string
  rating: string
  ecoFriendly: boolean
  fulfillment: string[]
}

const EMPTY_FILTERS: NearMeFilters = {
  serviceType: [],
  printingMethod: [],
  productType: [],
  rushAvailable: false,
  moq: '',
  turnaround: '',
  rating: '',
  ecoFriendly: false,
  fulfillment: [],
}

// ─── Filter pill components ──────────────────────────────────────────────────

function DropdownPill({
  label, isActive, isOpen, onToggle, children,
}: {
  label: string; isActive: boolean; isOpen: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
            : isOpen
            ? 'border-brand-400 bg-brand-50 text-brand-700'
            : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50'
        }`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 opacity-70 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-30 rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group" onClick={e => { e.preventDefault(); onChange() }}>
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 ${
        checked ? 'border-brand-600 bg-brand-600' : 'border-surface-300 group-hover:border-brand-400'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className={`text-sm transition-colors whitespace-nowrap ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
        {label}
      </span>
    </label>
  )
}

function RadioItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 py-1 cursor-pointer group" onClick={e => { e.preventDefault(); onChange() }}>
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
        checked ? 'border-brand-600 bg-brand-50' : 'border-surface-300 group-hover:border-brand-400'
      }`}>
        {checked && <span className="h-2 w-2 rounded-full bg-brand-600" />}
      </span>
      <span className={`text-sm transition-colors whitespace-nowrap ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
        {label}
      </span>
    </label>
  )
}

function NearMeFilterBar({
  filters,
  onChange,
  onClear,
}: {
  filters: NearMeFilters
  onChange: (f: NearMeFilters) => void
  onClear: () => void
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenGroup(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggleArray = (key: 'serviceType' | 'printingMethod' | 'productType' | 'fulfillment', val: string) => {
    const arr = filters[key]
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] })
  }

  const setRadio = (key: 'moq' | 'turnaround' | 'rating', val: string) => {
    onChange({ ...filters, [key]: filters[key] === val ? '' : val })
    setOpenGroup(null)
  }

  const hasActive = filters.serviceType.length > 0 || filters.printingMethod.length > 0 ||
    filters.productType.length > 0 || filters.rushAvailable || filters.moq || filters.turnaround ||
    filters.rating || filters.ecoFriendly || filters.fulfillment.length > 0

  return (
    <div ref={barRef} className="flex flex-wrap items-center justify-center gap-2">
      {/* Service Type */}
      <DropdownPill label="Service Type" isActive={filters.serviceType.length > 0} isOpen={openGroup === 'service'} onToggle={() => setOpenGroup(openGroup === 'service' ? null : 'service')}>
        <div className="space-y-0.5 min-w-[200px]">
          {ALL_SERVICES.map(s => (
            <CheckboxItem key={s} label={s} checked={filters.serviceType.includes(s)} onChange={() => toggleArray('serviceType', s)} />
          ))}
        </div>
      </DropdownPill>

      {/* Printing Method */}
      <DropdownPill label="Printing Method" isActive={filters.printingMethod.length > 0} isOpen={openGroup === 'method'} onToggle={() => setOpenGroup(openGroup === 'method' ? null : 'method')}>
        <div className="space-y-0.5 min-w-[210px]">
          {ALL_PRINTING_METHODS.map(m => (
            <CheckboxItem key={m} label={m} checked={filters.printingMethod.includes(m)} onChange={() => toggleArray('printingMethod', m)} />
          ))}
        </div>
      </DropdownPill>

      {/* Product Type */}
      <DropdownPill label="Product Type" isActive={filters.productType.length > 0} isOpen={openGroup === 'product'} onToggle={() => setOpenGroup(openGroup === 'product' ? null : 'product')}>
        <div className="space-y-0.5 min-w-[180px] max-h-[300px] overflow-y-auto">
          {ALL_PRODUCT_CATS.map(c => (
            <CheckboxItem key={c} label={c} checked={filters.productType.includes(c)} onChange={() => toggleArray('productType', c)} />
          ))}
        </div>
      </DropdownPill>

      {/* Rush */}
      <button
        type="button"
        onClick={() => onChange({ ...filters, rushAvailable: !filters.rushAvailable })}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
          filters.rushAvailable
            ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
            : 'border-surface-200 bg-white text-surface-700 hover:border-surface-300 hover:bg-surface-50'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Rush Printing
      </button>

      {/* Min Order */}
      <DropdownPill label="Min Order" isActive={!!filters.moq} isOpen={openGroup === 'moq'} onToggle={() => setOpenGroup(openGroup === 'moq' ? null : 'moq')}>
        <div className="space-y-0.5 min-w-[160px]">
          {MOQ_OPTIONS.map(o => (
            <RadioItem key={o.value} label={o.label} checked={filters.moq === o.value} onChange={() => setRadio('moq', o.value)} />
          ))}
        </div>
      </DropdownPill>

      {/* Turnaround */}
      <DropdownPill label="Turnaround" isActive={!!filters.turnaround} isOpen={openGroup === 'turnaround'} onToggle={() => setOpenGroup(openGroup === 'turnaround' ? null : 'turnaround')}>
        <div className="space-y-0.5 min-w-[180px]">
          {TURNAROUND_OPTIONS.map(o => (
            <RadioItem key={o.value} label={o.label} checked={filters.turnaround === o.value} onChange={() => setRadio('turnaround', o.value)} />
          ))}
        </div>
      </DropdownPill>

      {/* Rating */}
      <DropdownPill label="Rating" isActive={!!filters.rating} isOpen={openGroup === 'rating'} onToggle={() => setOpenGroup(openGroup === 'rating' ? null : 'rating')}>
        <div className="space-y-0.5 min-w-[140px]">
          {RATING_OPTIONS.map(o => (
            <RadioItem key={o.value} label={o.label} checked={filters.rating === o.value} onChange={() => setRadio('rating', o.value)} />
          ))}
        </div>
      </DropdownPill>

      {/* More */}
      <DropdownPill label="More" isActive={filters.ecoFriendly || filters.fulfillment.length > 0} isOpen={openGroup === 'more'} onToggle={() => setOpenGroup(openGroup === 'more' ? null : 'more')}>
        <div className="space-y-3 min-w-[190px]">
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Eco-Friendly</p>
            <CheckboxItem label="Eco-friendly options" checked={filters.ecoFriendly} onChange={() => onChange({ ...filters, ecoFriendly: !filters.ecoFriendly })} />
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Fulfillment</p>
            <CheckboxItem label="Pickup available" checked={filters.fulfillment.includes('Pickup')} onChange={() => toggleArray('fulfillment', 'Pickup')} />
            <CheckboxItem label="Delivery available" checked={filters.fulfillment.includes('Delivery')} onChange={() => toggleArray('fulfillment', 'Delivery')} />
          </div>
        </div>
      </DropdownPill>

      {/* Clear all */}
      {hasActive && (
        <button type="button" onClick={onClear} className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors ml-1">
          Clear all
        </button>
      )}
    </div>
  )
}

// ─── Map utilities ───────────────────────────────────────────────────────────

function makeMarkerIcon(selected: boolean, price: number | null) {
  const bg = selected ? '#dc2626' : '#4f46e5'
  const label = price ? `$${price}` : ''
  return L.divIcon({
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        background:${bg};color:#fff;font-weight:700;font-size:11px;
        padding:${label ? '4px 8px' : '0'};
        min-width:${label ? 'auto' : '14px'};
        height:${label ? 'auto' : '14px'};
        border-radius:${label ? '20px' : '50%'};
        border:2.5px solid #fff;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
        white-space:nowrap;
        transform:${selected ? 'scale(1.3)' : 'scale(1)'};
        transition:transform .15s;
      ">${label}</div>
    `,
    className: '',
    iconAnchor: label ? [undefined as unknown as number, 14] : [7, 7],
  })
}

function BoundsWatcher({ onChange }: { onChange: (b: Bounds) => void }) {
  const report = (m: L.Map) => {
    const b = m.getBounds()
    onChange({ n: b.getNorth(), s: b.getSouth(), e: b.getEast(), w: b.getWest() })
  }
  const map = useMapEvents({
    moveend: () => report(map),
    zoomend: () => report(map),
  })
  useEffect(() => { report(map) }, []) // eslint-disable-line
  return null
}

function MapFocus({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.setView([target.lat, target.lng], target.zoom ?? 13, { animate: true })
  }, [target, map])
  return null
}

// ─── FilterBar ───────────────────────────────────────────────────────────────

function FilterBar({
  onSearch,
  onLocate,
  loading,
  radius,
  onRadiusChange,
  sortBy,
  onSortChange,
}: {
  onSearch: (q: { query: string; state: string; radius: number }) => void
  onLocate: () => void
  loading: boolean
  radius: number
  onRadiusChange: (r: number) => void
  sortBy: SortKey
  onSortChange: (s: SortKey) => void
}) {
  const [query, setQuery] = useState('')
  const [state, setState] = useState('')

  const handleSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault()
    onSearch({ query, state, radius })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[70%] mx-auto"
    >
      {/* 5-column grid: State | Query | Radius | Sort | Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[180px_1fr_160px_160px_auto] gap-4 items-end">

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-surface-800">State</label>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="h-12 w-full border border-surface-200 rounded-xl px-3 py-0 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
          >
            <option value="">All States</option>
            {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* City / State / Zip */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-surface-800">City, State or Zip</label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for City, State or Zip"
            className="h-12 w-full border border-surface-200 rounded-xl px-4 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          />
        </div>

        {/* Radius */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-surface-800">Radius</label>
          <select
            value={radius}
            onChange={e => onRadiusChange(Number(e.target.value))}
            className="h-12 w-full border border-surface-200 rounded-xl px-3 py-0 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
          >
            {RADIUS_OPTIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-surface-800">Sort By</label>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value as SortKey)}
            className="h-12 w-full border border-surface-200 rounded-xl px-3 py-0 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
          >
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Search button */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-transparent select-none hidden lg:block">Search</label>
          <button
            type="submit"
            disabled={loading}
            className="h-12 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl px-7 text-sm font-semibold transition-colors whitespace-nowrap w-full lg:w-auto"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
            )}
            Search
          </button>
        </div>
      </div>

      {/* Use My Location — subtle secondary action */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onLocate}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Use My Location
        </button>
      </div>
    </form>
  )
}

// ─── ListingCard ─────────────────────────────────────────────────────────────

function ListingCard({
  company,
  selected,
  onClick,
  favorited,
  onToggleFav,
}: {
  company: Company
  selected: boolean
  onClick: () => void
  favorited: boolean
  onToggleFav: (e: React.MouseEvent) => void
}) {
  return (
    <div
      id={`listing-${company.id}`}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 bg-white group
        ${selected
          ? 'border-brand-500 shadow-lg shadow-brand-100 scale-[1.01]'
          : 'border-surface-200 shadow-sm hover:shadow-md hover:scale-[1.01]'
        }`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-surface-100">
        {company.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={company.coverImage}
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/80">{company.name.charAt(0)}</span>
          </div>
        )}

        {/* Badge */}
        {company.featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}

      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-surface-900 leading-tight truncate">{company.name}</h3>

        <div className="flex items-center gap-1 mt-1 text-surface-500">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-xs truncate">{company.city}</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-xs font-semibold text-surface-800">{company.rating}</span>
            <span className="text-xs text-surface-400">({company.reviewCount})</span>
          </div>
          {company.startingPrice && (
            <span className="text-xs font-bold text-brand-600">from ${company.startingPrice}</span>
          )}
        </div>

        {company.printingMethods.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {company.printingMethods.slice(0, 2).map(m => (
              <span key={m} className="text-[10px] bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded-full">{m}</span>
            ))}
            {company.printingMethods.length > 2 && (
              <span className="text-[10px] text-surface-400">+{company.printingMethods.length - 2}</span>
            )}
          </div>
        )}

        <a
          href={`/provider/${company.slug}`}
          onClick={e => e.stopPropagation()}
          className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-2 transition-colors"
        >
          View Details
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      {/* Selected indicator */}
      {selected && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" />}
    </div>
  )
}

// ─── MapView ─────────────────────────────────────────────────────────────────

function MapView({
  companies,
  selected,
  focusTarget,
  onBoundsChange,
  onMarkerClick,
}: {
  companies: Company[]
  selected: Company | null
  focusTarget: { lat: number; lng: number; zoom?: number } | null
  onBoundsChange: (b: Bounds) => void
  onMarkerClick: (c: Company) => void
}) {
  return (
    <MapContainer
      center={[33.9983, -118.2307]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <BoundsWatcher onChange={onBoundsChange} />
      <MapFocus target={focusTarget} />

      {companies.map(c => (
        <Marker
          key={c.id}
          position={[c.coordinates.lat, c.coordinates.lng]}
          icon={makeMarkerIcon(selected?.id === c.id, c.startingPrice)}
          eventHandlers={{ click: () => onMarkerClick(c) }}
          zIndexOffset={selected?.id === c.id ? 1000 : 0}
        >
          <Popup>
            <div style={{ minWidth: 170 }}>
              <p className="font-semibold text-sm text-surface-900">{c.name}</p>
              <p className="text-xs text-surface-500 mt-0.5">{c.address}</p>
              {c.startingPrice && (
                <p className="text-xs font-bold text-brand-600 mt-1">from ${c.startingPrice}</p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-xs font-semibold">{c.rating}</span>
                <span className="text-xs text-surface-400">({c.reviewCount})</span>
              </div>
              <a
                href={`/provider/${c.slug}`}
                className="block mt-2 text-center text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-3 py-1.5 transition-colors"
              >
                View Details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NearMeClient() {
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [selected, setSelected] = useState<Company | null>(null)
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null)
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState(25)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortKey>('rating')
  const [filters, setFilters] = useState<NearMeFilters>(EMPTY_FILTERS)
  const [loading, setLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const handleRadiusChange = useCallback((r: number) => {
    setRadius(r)
    if (searchCenter) {
      const zoom = RADIUS_OPTIONS.find(o => o.value === r)?.zoom ?? 11
      setFocusTarget({ lat: searchCenter.lat, lng: searchCenter.lng, zoom })
    }
  }, [searchCenter])

  const visible = useMemo(() => {
    let list = companies
    if (bounds) {
      list = list.filter(c => {
        const { lat, lng } = c.coordinates
        return lat >= bounds.s && lat <= bounds.n && lng >= bounds.w && lng <= bounds.e
      })
    }
    // Apply filters
    if (filters.serviceType.length > 0) {
      list = list.filter(c => filters.serviceType.some(s => c.servicesOffered?.includes(s)))
    }
    if (filters.printingMethod.length > 0) {
      list = list.filter(c => filters.printingMethod.some(m => c.printingMethods?.includes(m)))
    }
    if (filters.productType.length > 0) {
      list = list.filter(c => filters.productType.some(p => c.productCategories?.includes(p)))
    }
    if (filters.rushAvailable) {
      list = list.filter(c => c.rushAvailable)
    }
    if (filters.moq) {
      const max = Number(filters.moq)
      list = list.filter(c => c.moq <= max)
    }
    if (filters.turnaround) {
      const max = Number(filters.turnaround)
      list = list.filter(c => c.turnaroundDays > 0 && c.turnaroundDays <= max)
    }
    if (filters.rating) {
      const min = Number(filters.rating)
      list = list.filter(c => c.rating >= min)
    }
    if (filters.ecoFriendly) {
      list = list.filter(c => c.ecoFriendly)
    }
    if (filters.fulfillment.includes('Pickup')) {
      list = list.filter(c => c.pickup)
    }
    if (filters.fulfillment.includes('Delivery')) {
      list = list.filter(c => c.delivery)
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount
      return a.name.localeCompare(b.name)
    })
  }, [bounds, sortBy, filters])

  const handleMarkerClick = useCallback((c: Company) => {
    setSelected(c)
    setTimeout(() => {
      document.getElementById(`listing-${c.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }, [])

  const handleCardClick = useCallback((c: Company) => {
    setSelected(c)
    setFocusTarget({ lat: c.coordinates.lat, lng: c.coordinates.lng, zoom: 14 })
  }, [])

  const handleSearch = useCallback(async ({ query, state, radius: r }: { query: string; state: string; radius: number }) => {
    const fullQuery = [query, state].filter(Boolean).join(', ')
    if (!fullQuery) return
    setLoading(true)
    setGeoError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery + ', USA')}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data[0]) {
        const lat = +data[0].lat
        const lng = +data[0].lon
        const zoom = RADIUS_OPTIONS.find(o => o.value === r)?.zoom ?? 11
        setSearchCenter({ lat, lng })
        setFocusTarget({ lat, lng, zoom })
      } else {
        setGeoError('Location not found. Try a different search.')
      }
    } catch {
      setGeoError('Search failed. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { setGeoError('Geolocation not supported.'); return }
    navigator.geolocation.getCurrentPosition(
      p => setFocusTarget({ lat: p.coords.latitude, lng: p.coords.longitude, zoom: 12 }),
      () => setGeoError('Could not get your location.')
    )
  }, [])

  const toggleFav = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Top: Full-width filter bar ── */}
      <div className="w-full bg-white border-b border-surface-200 shrink-0">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">

          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Near Me</h1>
              <p className="text-sm text-surface-500 mt-0.5">
                Showing{' '}
                <span className="font-semibold text-surface-700">{visible.length}</span>{' '}
                printing {visible.length === 1 ? 'company' : 'companies'} in this area
              </p>
            </div>
          </div>

          {/* Filter bar */}
          <FilterBar
            onSearch={handleSearch}
            onLocate={handleLocate}
            loading={loading}
            radius={radius}
            onRadiusChange={handleRadiusChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Browse-style filters */}
          <div className="mt-4">
            <NearMeFilterBar
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
            />
          </div>

          {/* Errors + info */}
          {geoError && (
            <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {geoError}
            </p>
          )}
          <div className="mt-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-xs text-blue-700">
              Pan or zoom the map to explore — the list updates automatically to show only companies visible in your current view.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom: Cards 70% + Map 30% ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Cards — 70% */}
        <div ref={listRef} className="flex-[7] overflow-y-auto bg-surface-50">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <svg className="w-12 h-12 text-surface-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="font-semibold text-surface-500">No companies in this area</p>
              <p className="text-sm text-surface-400 mt-1">Zoom out or search a new location</p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-2 xl:grid-cols-3 gap-4">
              {visible.map(c => (
                <ListingCard
                  key={c.id}
                  company={c}
                  selected={selected?.id === c.id}
                  onClick={() => handleCardClick(c)}
                  favorited={favorites.has(c.id)}
                  onToggleFav={e => toggleFav(e, c.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map — 30% */}
        <div className="flex-[3] relative border-l border-surface-200">
          <MapView
            companies={companies}
            selected={selected}
            focusTarget={focusTarget}
            onBoundsChange={setBounds}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  )
}
