import { notFound } from 'next/navigation';
import { getProviderBySlug, getRelatedProviders } from '@/lib/data';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import GalleryLightbox from '@/components/GalleryLightbox';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) return {};
  return {
    title: provider.seoTitle,
    description: provider.seoDescription,
    openGraph: {
      title: provider.seoTitle,
      description: provider.seoDescription,
      type: 'website',
    },
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);
  if (!provider) notFound();

  const related = getRelatedProviders(slug);

  const gradients = [
    'from-brand-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-rose-600',
    'from-cyan-500 to-blue-600',
  ];

  return (
    <>
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
            <GalleryLightbox
              images={[provider.coverImage, ...provider.galleryImages].filter(Boolean) as string[]}
              providerName={provider.name}
              gradients={gradients}
              neighborhood={provider.neighborhood}
            />

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">{provider.name}</h1>
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
                      <span>{provider.neighborhood}, {provider.city}</span>
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
              <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
                <h3 className="text-lg font-semibold text-surface-900 mb-1">Request a Quote</h3>
                <p className="text-sm text-surface-500 mb-5">Get a custom quote from {provider.name}</p>
                
                <form className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Your Name</label>
                    <input type="text" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Email</label>
                    <input type="email" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Phone</label>
                    <input type="tel" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Service Needed</label>
                    <select className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all">
                      <option value="">Select a service</option>
                      {provider.servicesOffered.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Quantity</label>
                    <input type="number" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" placeholder="e.g., 100" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-700 mb-1">Project Details</label>
                    <textarea rows={3} className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none" placeholder="Describe your project…" />
                  </div>
                  <button type="button" className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm focus-ring">
                    Send Quote Request
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-surface-100 space-y-2 text-xs text-surface-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free, no-obligation quote
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Usually responds within 24 hours
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {provider.reviewCount} verified reviews
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-4 rounded-xl border border-surface-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-surface-800 mb-3">Contact</h4>
                <div className="space-y-2 text-sm text-surface-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-surface-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{provider.address}</span>
                  </div>
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: provider.name,
            description: provider.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: provider.address,
              addressLocality: provider.city,
              addressRegion: 'CA',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: provider.coordinates.lat,
              longitude: provider.coordinates.lng,
            },
            telephone: provider.phone,
            email: provider.email,
            url: provider.website,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: provider.rating,
              reviewCount: provider.reviewCount,
            },
          }),
        }}
      />
    </>
  );
}
