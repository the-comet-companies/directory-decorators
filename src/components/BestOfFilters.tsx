'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const SERVICES = [
  { id: 'screen-printing', name: 'Screen Printing' },
  { id: 'dtg-printing', name: 'DTG Printing' },
  { id: 'embroidery', name: 'Embroidery' },
  { id: 'dtf-printing', name: 'DTF Printing' },
  { id: 'heat-transfer', name: 'Heat Transfer' },
  { id: 'sublimation', name: 'Sublimation' },
]

const STATE_ABBR_TO_FULL: Record<string, string> = {
  'CA': 'California', 'NY': 'New York', 'IL': 'Illinois', 'TX': 'Texas',
  'OR': 'Oregon', 'FL': 'Florida', 'CO': 'Colorado', 'MA': 'Massachusetts',
  'OH': 'Ohio', 'MI': 'Michigan', 'MN': 'Minnesota', 'HI': 'Hawaii',
  'NV': 'Nevada', 'KS': 'Kansas', 'CT': 'Connecticut', 'NH': 'New Hampshire',
  'PA': 'Pennsylvania',
}

const TOP_CITIES = [
  { city: 'Los Angeles', state: 'CA', slug: 'los-angeles-ca' },
  { city: 'New York', state: 'NY', slug: 'new-york-ny' },
  { city: 'Chicago', state: 'IL', slug: 'chicago-il' },
  { city: 'Houston', state: 'TX', slug: 'houston-tx' },
  { city: 'Portland', state: 'OR', slug: 'portland-or' },
  { city: 'San Francisco', state: 'CA', slug: 'san-francisco-ca' },
  { city: 'Miami', state: 'FL', slug: 'miami-fl' },
  { city: 'Denver', state: 'CO', slug: 'denver-co' },
  { city: 'Austin', state: 'TX', slug: 'austin-tx' },
  { city: 'San Diego', state: 'CA', slug: 'san-diego-ca' },
  { city: 'Boston', state: 'MA', slug: 'boston-ma' },
  { city: 'Columbus', state: 'OH', slug: 'columbus-oh' },
  { city: 'Detroit', state: 'MI', slug: 'detroit-mi' },
  { city: 'Minneapolis', state: 'MN', slug: 'minneapolis-mn' },
  { city: 'Honolulu', state: 'HI', slug: 'honolulu-hi' },
  { city: 'Las Vegas', state: 'NV', slug: 'las-vegas-nv' },
  { city: 'Kansas City', state: 'KS', slug: 'kansas-city-ks' },
  { city: 'Hartford', state: 'CT', slug: 'hartford-ct' },
  { city: 'Manchester', state: 'NH', slug: 'manchester-nh' },
  { city: 'Philadelphia', state: 'PA', slug: 'philadelphia-pa' },
]

const STATES = [...new Set(TOP_CITIES.map(c => c.state))].sort((a, b) =>
  (STATE_ABBR_TO_FULL[a] || a).localeCompare(STATE_ABBR_TO_FULL[b] || b)
)

interface BestOfFiltersProps {
  currentServiceId: string
  currentCitySlug: string
}

export default function BestOfFilters({ currentServiceId, currentCitySlug }: BestOfFiltersProps) {
  const router = useRouter()
  const currentCity = TOP_CITIES.find(c => c.slug === currentCitySlug)
  const [selectedState, setSelectedState] = useState(currentCity?.state || '')
  const [search, setSearch] = useState(currentCity ? `${currentCity.city}, ${STATE_ABBR_TO_FULL[currentCity.state] || currentCity.state}` : '')
  const [showCities, setShowCities] = useState(false)

  const filteredCities = useMemo(() => {
    let cities = TOP_CITIES
    if (selectedState) cities = cities.filter(c => c.state === selectedState)
    if (search.trim()) {
      const q = search.toLowerCase()
      // Only filter if the search doesn't exactly match the current city display
      const currentDisplay = currentCity ? `${currentCity.city}, ${STATE_ABBR_TO_FULL[currentCity.state] || currentCity.state}` : ''
      if (search !== currentDisplay) {
        cities = cities.filter(c =>
          c.city.toLowerCase().includes(q) ||
          (STATE_ABBR_TO_FULL[c.state] || c.state).toLowerCase().includes(q)
        )
      }
    }
    return cities
  }, [selectedState, search, currentCity])

  function navigate(serviceId: string, citySlug: string) {
    const city = TOP_CITIES.find(c => c.slug === citySlug)
    if (city) {
      setSearch(`${city.city}, ${STATE_ABBR_TO_FULL[city.state] || city.state}`)
      setSelectedState(city.state)
    }
    setShowCities(false)
    router.push(`/best/${serviceId}-in-${citySlug}`)
  }

  const selectClass = 'h-11 w-full rounded-xl border border-surface-200 bg-white px-3 pr-8 text-sm text-surface-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer'
  const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1.5">State</label>
          <select
            value={selectedState}
            onChange={e => {
              setSelectedState(e.target.value)
              const citiesInState = TOP_CITIES.filter(c => c.state === e.target.value)
              if (citiesInState.length > 0) {
                navigate(currentServiceId, citiesInState[0].slug)
              }
            }}
            className={selectClass}
            style={{ backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            <option value="">All States</option>
            {STATES.map(st => (
              <option key={st} value={st}>{STATE_ABBR_TO_FULL[st] || st}</option>
            ))}
          </select>
        </div>

        {/* City Search */}
        <div className="relative">
          <label className="block text-sm font-semibold text-surface-800 mb-1.5">City</label>
          <input
            type="text"
            placeholder="Search for City"
            value={search}
            onFocus={() => setShowCities(true)}
            onChange={e => { setSearch(e.target.value); setShowCities(true) }}
            className="h-11 w-full rounded-xl border border-surface-200 bg-white px-3 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-0"
          />
          {showCities && filteredCities.length > 0 && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowCities(false)} />
              <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-surface-200 bg-white shadow-lg max-h-[240px] overflow-y-auto">
                {filteredCities.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => navigate(currentServiceId, c.slug)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      c.slug === currentCitySlug
                        ? 'bg-surface-50 text-surface-900 font-medium'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    {c.city}, {STATE_ABBR_TO_FULL[c.state] || c.state}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-semibold text-surface-800 mb-1.5">Service Type</label>
          <select
            value={currentServiceId}
            onChange={e => navigate(e.target.value, currentCitySlug)}
            className={selectClass}
            style={{ backgroundImage: chevron, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            {SERVICES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
