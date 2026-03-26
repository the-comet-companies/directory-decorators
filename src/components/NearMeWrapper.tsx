'use client'

import dynamic from 'next/dynamic'

const NearMeClient = dynamic(() => import('./NearMeClient'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 'calc(100vh - 64px)' }} className="flex items-center justify-center bg-surface-50">
      <div className="text-center">
        <svg className="w-10 h-10 animate-spin text-brand-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        <p className="text-sm text-surface-500">Loading map...</p>
      </div>
    </div>
  ),
})

export default function NearMeWrapper() {
  return <NearMeClient />
}
