'use client'

import { useEffect, useState } from 'react'

type TopCompany = { name: string; slug: string }

export default function Footer() {
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([])

  useEffect(() => {
    fetch('/api/top-companies')
      .then(r => (r.ok ? r.json() : []))
      .then(setTopCompanies)
      .catch(() => setTopCompanies([]))
  }, [])

  return (
    <footer className="mt-16 border-t border-surface-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">
                P
              </div>
              <span className="text-base font-bold tracking-tight text-surface-900">
                Print Services <span className="text-brand-600">Hub USA</span>
              </span>
            </div>
            <p className="text-sm text-surface-500 leading-relaxed mb-4">
              Discover and compare top-rated printing services across the United States for custom apparel, including screen printing, DTG, embroidery, and specialty finishes.
            </p>
            <a
              href="/list-business"
              className="inline-flex items-center rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              List Your Business
            </a>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'Screen Printing', href: '/?serviceType=Screen+Printing' },
                { label: 'DTG Printing', href: '/?serviceType=DTG+Printing' },
                { label: 'Embroidery', href: '/?serviceType=Embroidery' },
                { label: 'DTF Printing', href: '/?serviceType=DTF+Printing' },
                { label: 'Sublimation', href: '/?serviceType=Sublimation' },
                { label: 'Heat Transfer', href: '/?serviceType=Heat+Transfer' },
                { label: 'Custom Apparel', href: '/?serviceType=Custom+Apparel' },
                { label: 'All Services', href: '/services' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Top States</h3>
            <ul className="space-y-2">
              {[
                { label: 'California', href: '/state/california' },
                { label: 'Massachusetts', href: '/state/massachusetts' },
                { label: 'New York', href: '/state/new-york' },
                { label: 'Florida', href: '/state/florida' },
                { label: 'Michigan', href: '/state/michigan' },
                { label: 'Ohio', href: '/state/ohio' },
                { label: 'Oregon', href: '/state/oregon' },
                { label: 'Hawaii', href: '/state/hawaii' },
                { label: 'Connecticut', href: '/state/connecticut' },
                { label: 'New Hampshire', href: '/state/new-hampshire' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-surface-500 hover:text-brand-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Companies */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Top Companies</h3>
            <ul className="space-y-2">
              {topCompanies.map(c => (
                <li key={c.slug}>
                  <a
                    href={`/provider/${c.slug}`}
                    className="text-sm text-surface-500 hover:text-brand-600 transition-colors line-clamp-1"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-400">
            © 2026 Print Services Hub USA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-surface-400 hover:text-surface-600 transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
            </a>
            <a href="#" className="text-surface-400 hover:text-surface-600 transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-surface-400 hover:text-surface-600 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
