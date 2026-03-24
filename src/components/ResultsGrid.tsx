'use client';

import { Provider } from '@/lib/types';
import ProviderCard from './ProviderCard';
import { useEffect, useRef, useState } from 'react';

interface ResultsGridProps {
  providers: Provider[];
  total: number;
}

export default function ResultsGrid({ providers, total }: ResultsGridProps) {
  if (providers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {providers.map((provider, index) => (
        <AnimatedCard key={provider.id} index={index}>
          <ProviderCard provider={provider} index={index} />
        </AnimatedCard>
      ))}
    </div>
  );
}

function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-100 mb-5">
        <svg className="w-10 h-10 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-surface-800 mb-2">No matching providers</h3>
      <p className="text-sm text-surface-500 max-w-md leading-relaxed">
        Try adjusting your filters or search terms to find printing services that match your needs. You can also clear all filters to see every provider.
      </p>
    </div>
  );
}
