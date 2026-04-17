'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';

interface FilterBarProps {
  filterOptions: {
    services: string[];
    screenPrintingTypes: string[];
    productCategories: string[];
    moqOptions: { label: string; value: string }[];
    turnaroundOptions: { label: string; value: string }[];
    ratingOptions: { label: string; value: string }[];
  };
  activeFilters: Record<string, string | string[]>;
}

export default function FilterBar({ filterOptions, activeFilters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

  const activeServiceTypes = (activeFilters.serviceType as string[]) || [];
  const activeScreenTypes = (activeFilters.screenPrintingType as string[]) || [];
  const activeProductTypes = (activeFilters.productType as string[]) || [];
  const activeFulfillment = (activeFilters.fulfillment as string[]) || [];

  const hasActiveFilters = Object.values(activeFilters).some(v =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <div ref={barRef} className="relative mb-6">
      <div className="flex flex-wrap items-center gap-2">

        {/* Service Type */}
        <DropdownPill
          label="Service Type"
          isActive={activeServiceTypes.length > 0}
          isOpen={openGroup === 'service'}
          onToggle={() => setOpenGroup(openGroup === 'service' ? null : 'service')}
        >
          <div className="space-y-0.5 min-w-[200px]">
            {filterOptions.services.map(s => (
              <CheckboxItem
                key={s}
                label={s}
                checked={activeServiceTypes.includes(s)}
                onChange={() => updateFilter('serviceType', s, true)}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Screen Printing Style */}
        <DropdownPill
          label="Screen Printing Style"
          isActive={activeScreenTypes.length > 0}
          isOpen={openGroup === 'screenprint'}
          onToggle={() => setOpenGroup(openGroup === 'screenprint' ? null : 'screenprint')}
        >
          <div className="space-y-0.5 min-w-[210px]">
            {filterOptions.screenPrintingTypes.map(t => (
              <CheckboxItem
                key={t}
                label={t}
                checked={activeScreenTypes.includes(t)}
                onChange={() => updateFilter('screenPrintingType', t, true)}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Product Type */}
        <DropdownPill
          label="Product Type"
          isActive={activeProductTypes.length > 0}
          isOpen={openGroup === 'product'}
          onToggle={() => setOpenGroup(openGroup === 'product' ? null : 'product')}
        >
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 min-w-[380px]">
            {filterOptions.productCategories.map(c => (
              <CheckboxItem
                key={c}
                label={c}
                checked={activeProductTypes.includes(c)}
                onChange={() => updateFilter('productType', c, true)}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Rush Printing toggle */}
        <button
          onClick={() => updateFilter('rushAvailable', 'true')}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
            activeFilters.rushAvailable === 'true'
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
        <DropdownPill
          label="Min Order"
          isActive={!!activeFilters.moq}
          isOpen={openGroup === 'moq'}
          onToggle={() => setOpenGroup(openGroup === 'moq' ? null : 'moq')}
        >
          <div className="space-y-0.5 min-w-[160px]">
            {filterOptions.moqOptions.map(o => (
              <RadioItem
                key={o.value}
                label={o.label}
                checked={activeFilters.moq === o.value}
                onChange={() => { updateFilter('moq', o.value); setOpenGroup(null); }}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Turnaround */}
        <DropdownPill
          label="Turnaround"
          isActive={!!activeFilters.turnaround}
          isOpen={openGroup === 'turnaround'}
          onToggle={() => setOpenGroup(openGroup === 'turnaround' ? null : 'turnaround')}
        >
          <div className="space-y-0.5 min-w-[180px]">
            {filterOptions.turnaroundOptions.map(o => (
              <RadioItem
                key={o.value}
                label={o.label}
                checked={activeFilters.turnaround === o.value}
                onChange={() => { updateFilter('turnaround', o.value); setOpenGroup(null); }}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Rating */}
        <DropdownPill
          label="Rating"
          isActive={!!activeFilters.rating}
          isOpen={openGroup === 'rating'}
          onToggle={() => setOpenGroup(openGroup === 'rating' ? null : 'rating')}
        >
          <div className="space-y-0.5 min-w-[140px]">
            {filterOptions.ratingOptions.map(o => (
              <RadioItem
                key={o.value}
                label={o.label}
                checked={activeFilters.rating === o.value}
                onChange={() => { updateFilter('rating', o.value); setOpenGroup(null); }}
              />
            ))}
          </div>
        </DropdownPill>

        {/* Features */}
        <DropdownPill
          label="Features"
          isActive={
            activeFilters.bulkOrders === 'true' || activeFilters.smallBatch === 'true' ||
            activeFilters.customDesign === 'true' || activeFilters.onlineOrdering === 'true' ||
            activeFilters.ecoFriendly === 'true'
          }
          isOpen={openGroup === 'features'}
          onToggle={() => setOpenGroup(openGroup === 'features' ? null : 'features')}
        >
          <div className="space-y-3 min-w-[210px]">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Production</p>
              <CheckboxItem
                label="Bulk orders"
                checked={activeFilters.bulkOrders === 'true'}
                onChange={() => updateFilter('bulkOrders', 'true')}
              />
              <CheckboxItem
                label="Small batch / No minimum"
                checked={activeFilters.smallBatch === 'true'}
                onChange={() => updateFilter('smallBatch', 'true')}
              />
              <CheckboxItem
                label="Eco-friendly"
                checked={activeFilters.ecoFriendly === 'true'}
                onChange={() => updateFilter('ecoFriendly', 'true')}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Services</p>
              <CheckboxItem
                label="Custom design help"
                checked={activeFilters.customDesign === 'true'}
                onChange={() => updateFilter('customDesign', 'true')}
              />
              <CheckboxItem
                label="Online ordering"
                checked={activeFilters.onlineOrdering === 'true'}
                onChange={() => updateFilter('onlineOrdering', 'true')}
              />
            </div>
          </div>
        </DropdownPill>

        {/* Fulfillment */}
        <DropdownPill
          label="Fulfillment"
          isActive={activeFulfillment.length > 0 || activeFilters.nationwideShipping === 'true'}
          isOpen={openGroup === 'fulfillment'}
          onToggle={() => setOpenGroup(openGroup === 'fulfillment' ? null : 'fulfillment')}
        >
          <div className="space-y-0.5 min-w-[200px]">
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
            <CheckboxItem
              label="Nationwide shipping"
              checked={activeFulfillment.includes('Nationwide Shipping') || activeFilters.nationwideShipping === 'true'}
              onChange={() => updateFilter('nationwideShipping', 'true')}
            />
          </div>
        </DropdownPill>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors ml-1"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function DropdownPill({
  label, isActive, isOpen, onToggle, children,
}: {
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
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
        <svg
          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-30 rounded-xl border border-surface-200 bg-white p-3 shadow-lg">
          {children}
        </div>
      )}
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
      <span className={`text-sm transition-colors whitespace-nowrap ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
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
      <span className={`text-sm transition-colors whitespace-nowrap ${checked ? 'text-surface-900 font-medium' : 'text-surface-600 group-hover:text-surface-800'}`}>
        {label}
      </span>
    </label>
  );
}
