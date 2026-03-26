'use client'

import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Browse' },
  { href: '/services', label: 'Services' },
  { href: '/near-me', label: 'Near Me' },
  { href: '/guides', label: 'Guides' },
  { href: '/about', label: 'About' },
]

export default function NavLinks() {
  const pathname = usePathname()

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
    </>
  )
}
