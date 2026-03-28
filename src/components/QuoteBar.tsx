'use client'

import { useState, useCallback } from 'react'

export function useQuoteSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = useCallback((slug: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else if (next.size < 3) {
        next.add(slug)
      }
      return next
    })
  }, [])

  const isSelected = useCallback((slug: string) => selected.has(slug), [selected])

  return { selected, toggle, isSelected, count: selected.size }
}

export function QuoteBar({ selected }: { selected: Set<string> }) {
  if (selected.size === 0) return null

  const slugs = Array.from(selected).join(',')

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-black text-white border-t border-neutral-800 shadow-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <p className="text-sm">
          <span className="font-semibold">{selected.size}</span> provider{selected.size > 1 ? 's' : ''} selected
          <span className="text-neutral-400 ml-1">(max 3)</span>
        </p>
        <a
          href={`/request-quotes?providers=${slugs}`}
          className="rounded-full bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-neutral-100 transition-colors"
        >
          Request Quote{selected.size > 1 ? 's' : ''}
        </a>
      </div>
    </div>
  )
}

export function QuoteCheckbox({
  slug,
  isSelected,
  onToggle,
}: {
  slug: string
  isSelected: boolean
  onToggle: (slug: string) => void
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(slug); }}
      className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
        isSelected
          ? 'bg-black text-white shadow-md'
          : 'bg-white/90 text-surface-400 hover:text-surface-700 shadow-sm backdrop-blur-sm'
      }`}
      title={isSelected ? 'Remove from quote' : 'Add to quote request'}
    >
      {isSelected ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
        </svg>
      )}
    </button>
  )
}
