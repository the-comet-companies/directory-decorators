'use client'

import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const LINKS = [
  { href: '/', label: 'Browse' },
  { href: '/services', label: 'Services' },
  { href: '/near-me', label: 'Near Me' },
  { href: '/guides', label: 'Guides' },
  { href: '/about', label: 'About' },
]

const MORE_LINKS = [
  { href: '/cost-estimator', label: 'Cost Estimator' },
  { href: '/request-quotes', label: 'Multi Quote' },
  { href: '/best/screen-printing-in-los-angeles-ca', label: 'Top Companies' },
  { href: '/auth/login', label: 'Login' },
]

export default function NavLinks() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isMoreActive = MORE_LINKS.some(l => pathname.startsWith(l.href))

  return (
    <>
      {LINKS.map(({ href, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <a
            key={href}
            href={href}
            className={`text-sm font-medium transition-colors focus-ring rounded-md px-1 py-0.5 ${
              isActive
                ? 'text-brand-600 border-b-2 border-brand-600 pb-0'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            {label}
          </a>
        )
      })}

      {/* More dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(prev => !prev)}
          className={`text-sm font-medium transition-colors focus-ring rounded-md px-1 py-0.5 inline-flex items-center gap-1 ${
            isMoreActive
              ? 'text-brand-600 border-b-2 border-brand-600 pb-0'
              : 'text-surface-600 hover:text-surface-900'
          }`}
        >
          More
          <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl border border-surface-200 shadow-lg py-1.5 z-50">
            {MORE_LINKS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href)
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-brand-600 font-semibold bg-surface-50'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
