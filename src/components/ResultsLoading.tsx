'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Wraps the results area. When the URL params change (filter, pagination, sort,
// search), overlays the results with a subtle backdrop + 4 bouncing dots while
// the new data streams in.
export default function ResultsLoading({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setLoading(true)
    const hide = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(hide)
  }, [pathname, searchParams])

  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '240ms' }} />
            <span className="w-3 h-3 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '360ms' }} />
          </div>
        </div>
      )}
    </div>
  )
}
