export const revalidate = 86400;

import { notFound } from 'next/navigation';
import { getProviderBySlug, getRelatedProviders } from '@/lib/data';
import type { Metadata } from 'next';
import { fullStateName } from '@/lib/states';
import { formatAddress } from '@/lib/address';
import { isBusinessClaimed } from '@/lib/db';
import Footer from '@/components/Footer';
import GalleryLightbox from '@/components/GalleryLightbox';
import ProviderQuoteForm from '@/components/ProviderQuoteForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};

  const state = provider.serviceArea[1] || '';
  const title = `${provider.name} — ${provider.city}, ${state} | Reviews & Services 2026`;
  const description = `${provider.name} in ${provider.city}, ${state} — rated ${provider.rating}/5 from ${provider.reviewCount} reviews. Services: ${provider.servicesOffered.slice(0,3).join(', ')}. Compare and contact today.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://directory.shoptitan.app/provider/${slug}`,
      images: provider.coverImage ? [{ url: provider.coverImage, alt: provider.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://directory.shoptitan.app/provider/${slug}`,
    },
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const related = await getRelatedProviders(slug);
  const claimed = await isBusinessClaimed(slug);


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: provider.name,
            description: provider.shortSummary,
            url: `https://directory.shoptitan.app/provider/${provider.slug}`,
            telephone: provider.phone || undefined,
            ...(provider.address ? { address: {
              '@type': 'PostalAddress',
              streetAddress: provider.address,
              addressLocality: provider.city,
              addressRegion: provider.serviceArea?.[1] || '',
              addressCountry: 'US',
            } } : {}),
            geo: provider.coordinates ? {
              '@type': 'GeoCoordinates',
              latitude: provider.coordinates.lat,
              longitude: provider.coordinates.lng,
            } : undefined,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: provider.rating,
              reviewCount: provider.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
            image: provider.coverImage || undefined,
            priceRange: provider.startingPrice ? `From $${provider.startingPrice}` : '$$',
          }),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Printing Services</a>
          <span className="mx-2">›</span>
          <span className="text-surface-800 font-medium">{provider.name}</span>
        </nav>

        <div className="flex gap-8 lg:gap-12">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="aspect-[16/9] md:aspect-auto">
              <GalleryLightbox
                images={Array.from(new Set([provider.coverImage, ...provider.galleryImages].filter(Boolean) as string[]))}
                providerName={provider.name}
              />
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
                    {provider.name}
                    {claimed && (
                      <svg className="w-6 h-6 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-sm text-surface-500 flex-wrap">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-surface-800">{provider.rating}</span>
                      <span>({provider.reviewCount} reviews)</span>
                    </div>
                    <span className="text-surface-300">·</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{[fullStateName(provider.serviceArea?.[1]), provider.city].filter(Boolean).join(', ') || 'United States'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {provider.rushAvailable && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">⚡ Rush Available</span>
                  )}
                  {provider.ecoFriendly && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">🌿 Eco-Friendly</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-surface-900 mb-3">About</h2>
              <p className="text-sm text-surface-600 leading-relaxed">{provider.description}</p>
              {provider.website && (
                <a
                  href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Website
                </a>
              )}
            </section>

            {/* Services & Products */}
            <section className="mb-8 grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.servicesOffered.map(s => (
                    <span key={s} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Product Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.productCategories.map(c => (
                    <span key={c} className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-medium text-surface-600">{c}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Printing Methods & Finishing */}
            <section className="mb-8 grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Printing Methods</h2>
                <ul className="space-y-1.5">
                  {provider.printingMethods.map(m => (
                    <li key={m} className="flex items-center gap-2 text-sm text-surface-600">
                      <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Finishing Options</h2>
                <ul className="space-y-1.5">
                  {provider.finishingOptions.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-surface-600">
                      <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Map */}
            {provider.coordinates && provider.coordinates.lat !== 0 && provider.coordinates.lng !== 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-surface-900 mb-3">Location</h2>
              <div className="rounded-2xl overflow-hidden border border-surface-200">
                <iframe
                  title={`Map showing location of ${provider.name}`}
                  src={`https://maps.google.com/maps?q=${provider.coordinates.lat},${provider.coordinates.lng}&z=15&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <a
                href={`https://www.google.com/maps?q=${provider.coordinates.lat},${provider.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-brand-600 hover:text-brand-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Google Maps
              </a>
            </section>
            )}

            {/* Sustainability */}
            {provider.sustainabilityTags.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Sustainability</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.sustainabilityTags.map(tag => (
                    <span key={tag} className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                      🌿 {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ */}
            {provider.faqs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {provider.faqs.map((faq, i) => (
                    <details key={i} className="group rounded-xl border border-surface-200 bg-white overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-surface-800 hover:bg-surface-50 transition-colors">
                        {faq.question}
                        <svg className="w-4 h-4 text-surface-400 transition-transform group-open:rotate-180 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-surface-600 leading-relaxed">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {provider.reviews.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-surface-900">Reviews</h2>
                  <div className="flex items-center gap-1.5 text-sm">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-surface-800">{provider.rating}</span>
                    <span className="text-surface-400">({provider.reviewCount})</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {provider.reviews.map(review => (
                    <div key={review.id} className="rounded-xl border border-surface-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-surface-800">{review.author}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400' : 'text-surface-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-surface-400">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <p className="text-sm text-surface-600 leading-relaxed">{review.text}</p>
                      <span className="inline-block mt-2 rounded-full bg-surface-100 px-2 py-0.5 text-xs text-surface-500">{review.serviceUsed}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related providers */}
            {related.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-surface-900 mb-4">Similar Providers</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {related.map(rp => (
                    <a key={rp.id} href={`/provider/${rp.slug}`} className="group rounded-xl border border-surface-200 bg-white p-4 hover:shadow-card-hover hover:border-surface-300 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-sm shrink-0">
                          {rp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-surface-800 truncate group-hover:text-brand-700 transition-colors">{rp.name}</h3>
                          <p className="text-xs text-surface-500">{rp.neighborhood}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-500">
                        <span className="flex items-center gap-0.5">
                          <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {rp.rating}
                        </span>
                        <span className="text-surface-300">·</span>
                        <span>{rp.servicesOffered.slice(0, 2).join(', ')}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar - Quote form */}
          <div className="hidden lg:block w-80 shrink-0">
            <div id="quote" className="sticky top-20">
              <ProviderQuoteForm
                providerName={provider.name}
                providerSlug={provider.slug}
                providerEmail={provider.email}
                services={provider.servicesOffered}
                reviewCount={provider.reviewCount}
              />

              {/* Contact info */}
              <div className="mt-4 rounded-xl border border-surface-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-surface-800 mb-3">Contact</h4>
                <div className="space-y-2 text-sm text-surface-600">
                  {(provider.address || provider.city) && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-surface-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{formatAddress(provider)}</span>
                  </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-surface-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-surface-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{provider.email}</span>
                  </div>
                </div>
              </div>

              {/* Claim This Business */}
              {!claimed && (
              <div className="mt-4 rounded-xl border border-surface-200 bg-white p-4">
                <p className="text-xs text-surface-500 mb-3">Is this your business?</p>
                <a
                  href={`/claim/${provider.slug}`}
                  className="block w-full rounded-xl bg-black text-white text-center py-2.5 text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Claim This Business
                </a>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200 bg-white/95 backdrop-blur-lg p-3 lg:hidden">
        <div className="flex gap-2 max-w-lg mx-auto">
          <a href={`tel:${provider.phone}`} className="flex-1 rounded-full border border-surface-300 py-2.5 text-center text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            Call
          </a>
          <a href="#quote" className="flex-1 rounded-full bg-brand-600 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700 transition-colors shadow-sm">
            Request Quote
          </a>
        </div>
      </div>

      <Footer />

      {/* JSON-LD: LocalBusiness + AggregateRating + Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `https://directory.shoptitan.app/provider/${provider.slug}`,
            name: provider.name,
            description: provider.description,
            image: [provider.coverImage, ...(provider.galleryImages || [])].filter(Boolean),
            ...(provider.address ? { address: {
              '@type': 'PostalAddress',
              streetAddress: provider.address,
              addressLocality: provider.city,
              addressRegion: provider.serviceArea?.[1] || '',
              addressCountry: 'US',
            } } : {}),
            geo: {
              '@type': 'GeoCoordinates',
              latitude: provider.coordinates.lat,
              longitude: provider.coordinates.lng,
            },
            telephone: provider.phone || undefined,
            email: provider.email || undefined,
            url: provider.website || `https://directory.shoptitan.app/provider/${provider.slug}`,
            priceRange: provider.startingPrice ? `From $${provider.startingPrice}` : undefined,
            ...(provider.rating > 0 && provider.reviewCount > 0 ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: provider.rating,
                bestRating: 5,
                worstRating: 1,
                reviewCount: provider.reviewCount,
              },
            } : {}),
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Printing Services',
              itemListElement: provider.servicesOffered.map(s => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: s,
                },
              })),
            },
            areaServed: provider.serviceArea.length > 0 ? {
              '@type': 'City',
              name: provider.serviceArea[0],
            } : undefined,
          }),
        }}
      />
      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Printing Services', item: 'https://directory.shoptitan.app' },
              { '@type': 'ListItem', position: 2, name: provider.name, item: `https://directory.shoptitan.app/provider/${provider.slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
