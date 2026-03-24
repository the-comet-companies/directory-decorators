'use client';

import { useState, useEffect } from 'react';
import FilterSidebar from './FilterSidebar';

interface MobileFilterDrawerProps {
  filterOptions: Parameters<typeof FilterSidebar>[0]['filterOptions'];
  activeFilters: Record<string, string | string[]>;
  resultCount: number;
}

export default function MobileFilterDrawer({ filterOptions, activeFilters, resultCount }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors focus-ring"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {Object.values(activeFilters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
            {Object.values(activeFilters).reduce((count, v) => count + (Array.isArray(v) ? v.length : v ? 1 : 0), 0)}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-elevated transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto px-5 py-4">
          <FilterSidebar
            filterOptions={filterOptions}
            activeFilters={activeFilters}
            resultCount={resultCount}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
