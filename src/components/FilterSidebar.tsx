'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface FilterSidebarProps {
  filterOptions: {
    services: string[];
    screenPrintingTypes: string[];
    productCategories: string[];
    moqOptions: { label: string; value: string }[];
    turnaroundOptions: { label: string; value: string }[];
    ratingOptions: { label: string; value: string }[];
  };
  activeFilters: Record<string, string | string[]>;
  resultCount: number;
  className?: string;
  onClose?: () => void;
}

export default function FilterSidebar({ filterOptions, activeFilters, resultCount, className = '', onClose }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string, isArray = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (isArray) {
      const current = params.getAll(key);
      if (current.includes(value)) {
        params.delete(key);
        current.filter(v => v !== value).forEach(v => params.append(key, v));
      } else {
        params.append(key, value);
      }
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = Object.values(activeFilters).some(v =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  const activeServiceTypes = (activeFilters.serviceType as string[]) || [];
  const activeScreenTypes = (activeFilters.screenPrintingType as string[]) || [];
  const activeFulfillment = (activeFilters.fulfillment as string[]) || [];

  return (
    <aside className={`space-y-1 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-surface-900 uppercase tracking-wider">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors focus-ring rounded">
              Clear all
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-100 transition-colors focus-ring" aria-label="Close filters">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 pb-3 border-b border-surface-200 mb-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const values = Array.isArray(value) ? value : value ? [value] : [];
            return values.map(v => (
              <button
                key={`${key}-${v}`}
                onClick={() => updateFilter(key, v, Array.isArray(activeFilters[key]))}
                className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-all duration-200 group focus-ring"
              >
                {v}
                <svg className="w-3 h-3 opacity-60 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ));
          })}
        </div>
      )}

      <FilterGroup title="Service Type">
        {filterOptions.services.map(s => (
          <CheckboxItem
            key={s}
            label={s}
            checked={activeServiceTypes.includes(s)}
            onChange={() => updateFilter('serviceType', s, true)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Screen Print Type" defaultOpen={false}>
        {filterOptions.screenPrintingTypes.map(t => (
          <CheckboxItem
            key={t}
            label={t}
            checked={activeScreenTypes.includes(t)}
            onChange={() => updateFilter('screenPrintingType', t, true)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Product Type">
        {filterOptions.productCategories.map(c => (
          <CheckboxItem
            key={c}
            label={c}
            checked={(activeFilters.productType as string[] || []).includes(c)}
            onChange={() => updateFilter('productType', c, true)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rush Printing" defaultOpen={false}>
        <CheckboxItem
          label="Rush / expedited service available"
          checked={activeFilters.rushAvailable === 'true'}
          onChange={() => updateFilter('rushAvailable', 'true')}
        />
      </FilterGroup>

      <FilterGroup title="Minimum Order" defaultOpen={false}>
        {filterOptions.moqOptions.map(o => (
          <RadioItem
            key={o.value}
            label={o.label}
            checked={activeFilters.moq === o.value}
            onChange={() => updateFilter('moq', o.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Turnaround Time" defaultOpen={false}>
        {filterOptions.turnaroundOptions.map(o => (
          <RadioItem
            key={o.value}
            label={o.label}
            checked={activeFilters.turnaround === o.value}
            onChange={() => updateFilter('turnaround', o.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating" defaultOpen={false}>
        {filterOptions.ratingOptions.map(o => (
          <RadioItem
            key={o.value}
            label={o.label}
            checked={activeFilters.rating === o.value}
            onChange={() => updateFilter('rating', o.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Eco-Friendly" defaultOpen={false}>
        <CheckboxItem
          label="Eco-friendly options"
          checked={activeFilters.ecoFriendly === 'true'}
          onChange={() => updateFilter('ecoFriendly', 'true')}
        />
      </FilterGroup>

      <FilterGroup title="Fulfillment" defaultOpen={false}>
        <CheckboxItem
          label="Pickup available"
          checked={activeFulfillment.includes('Pickup')}
          onChange={() => updateFilter('fulfillment', 'Pickup', true)}
        />
        <CheckboxItem
          label="Delivery available"
          checked={activeFulfillment.includes('Delivery')}
          onChange={() => updateFilter('fulfillment', 'Delivery', true)}
        />
      </FilterGroup>

      {/* Mobile apply button */}
      {onClose && (
        <div className="pt-4 border-t border-surface-200">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors focus-ring"
          >
            Show {resultCount} result{resultCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </aside>
  );
}

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-surface-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-surface-800 hover:text-surface-900 transition-colors focus-ring rounded-md"
      >
        {title}
        <svg className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'max-h-96 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-1 pl-0.5">{children}</div>
      </div>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      className="flex items-center gap-2.5 py-1 cursor-pointer group"
      onClick={(e) => { e.preventDefault(); onChange(); }}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150 ${
        checked ? 'border-brand-600 bg-brand-600' : 'border-surface-300 group-hover:border-brand-400'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className={`text-sm transition-colors ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
        {label}
      </span>
    </label>
  );
}

function RadioItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      className="flex items-center gap-2.5 py-1 cursor-pointer group"
      onClick={(e) => { e.preventDefault(); onChange(); }}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-150 ${
        checked ? 'border-brand-600 bg-brand-50' : 'border-surface-300 group-hover:border-brand-400'
      }`}>
        {checked && <span className="h-2 w-2 rounded-full bg-brand-600" />}
      </span>
      <span className={`text-sm transition-colors ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
        {label}
      </span>
    </label>
  );
}
