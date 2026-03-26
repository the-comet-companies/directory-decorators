'use client';

import { Provider } from '@/lib/types';
import { useState } from 'react';

interface ProviderCardProps {
  provider: Provider;
  index: number;
}

function getDomain(website: string): string | null {
  try {
    return new URL(website).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export default function ProviderCard({ provider, index }: ProviderCardProps) {
  const [coverError, setCoverError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const placeholderGradients = [
    'from-brand-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-fuchsia-600',
    'from-amber-500 to-orange-600',
  ];

  const gradient = placeholderGradients[index % placeholderGradients.length];
  const domain = provider.website ? getDomain(provider.website) : null;
  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
  const coverImage = provider.coverImage && !coverError ? provider.coverImage : null;

  return (
    <article
      className="group relative rounded-2xl border border-surface-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-surface-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Cover / Logo area */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {coverImage ? (
          <>
            <img
              src={coverImage}
              alt={`${provider.name} — ${provider.servicesOffered.slice(0, 2).join(', ')} in ${provider.city}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={() => setCoverError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            {faviconUrl && !faviconError ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src={faviconUrl}
                    alt={`${provider.name} logo`}
                    width={64}
                    height={64}
                    className="w-10 h-10 object-contain"
                    onError={() => setFaviconError(true)}
                  />
                </div>
                <span className="text-xs font-medium text-white/80">{domain}</span>
              </div>
            ) : (
              <div className="text-center text-white/90">
                <span className="text-4xl font-bold block">{provider.name.charAt(0)}</span>
                <span className="text-xs font-medium mt-1 block opacity-75">{provider.neighborhood}</span>
              </div>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured badge */}
        {provider.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-surface-700">Featured</span>
          </div>
        )}


        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {provider.rushAvailable && (
            <span className="rounded-full bg-amber-500/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-white">
              ⚡ Rush
            </span>
          )}
          {provider.ecoFriendly && (
            <span className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-white">
              🌿 Eco
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name and rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-surface-900 group-hover:text-brand-700 transition-colors leading-tight">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-surface-800">{provider.rating}</span>
            <span className="text-xs text-surface-400">({provider.reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-surface-500 mb-3">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{provider.neighborhood}, {provider.city}</span>
        </div>

        {/* Summary */}
        <p className="text-sm text-surface-600 leading-relaxed mb-3 line-clamp-2">{provider.shortSummary}</p>

        {/* Service tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.servicesOffered.slice(0, 3).map(service => (
            <span key={service} className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600">
              {service}
            </span>
          ))}
          {provider.servicesOffered.length > 3 && (
            <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-400">
              +{provider.servicesOffered.length - 3}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-surface-500 mb-4 pb-4 border-b border-surface-100">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{provider.turnaroundDays === 1 ? 'Same day' : `${provider.turnaroundDays} days`}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>MOQ: {provider.moq === 1 ? 'None' : provider.moq}</span>
          </div>
          {provider.startingPrice && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-surface-700">From ${provider.startingPrice.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Fulfillment badges */}
        <div className="flex items-center gap-2 mb-4">
          {provider.pickup && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pickup
            </span>
          )}
          {provider.delivery && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-500">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Delivery
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2">
          <a
            href={`/provider/${provider.slug}`}
            className="flex-1 rounded-full border border-surface-300 py-2.5 text-center text-sm font-medium text-surface-700 hover:bg-surface-50 hover:border-surface-400 transition-all duration-200 focus-ring"
          >
            View Details
          </a>
          <a
            href={`/provider/${provider.slug}#quote`}
            className="flex-1 rounded-full bg-brand-600 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700 transition-all duration-200 shadow-sm focus-ring"
          >
            Request Quote
          </a>
        </div>
      </div>
    </article>
  );
}
