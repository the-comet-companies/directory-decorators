import { notFound } from 'next/navigation';
import { getCityBySlug, getProvidersForCity, getAllCitySlugs, getStateSlug } from '@/lib/geo';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ProviderCard from '@/components/ProviderCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  const providers = getProvidersForCity(city.city, city.stateAbbr);
  const title = `Printing Services in ${city.city}, ${city.stateAbbr} | ${providers.length} Companies`;
  const description = `Find ${providers.length} printing ${providers.length === 1 ? 'company' : 'companies'} in ${city.city}, ${city.stateName}. Compare screen printing, embroidery, DTG, and custom apparel services near you.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://directory.dtlaprint.com/city/${slug}` },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const providers = getProvidersForCity(city.city, city.stateAbbr);
  const stateSlug = getStateSlug(city.stateAbbr);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href={`/state/${stateSlug}`} className="hover:text-brand-600 transition-colors">{city.stateName}</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">{city.city}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">
            Printing Services in {city.city}, {city.stateAbbr}
          </h1>
          <p className="text-surface-500 mt-2">
            Found <span className="font-semibold text-surface-700">{providers.length}</span> printing{' '}
            {providers.length === 1 ? 'company' : 'companies'} in {city.city}, {city.stateName}.
          </p>
        </div>

        {/* Provider grid */}
        {providers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providers.map((p, i) => (
              <ProviderCard key={p.id} provider={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-surface-500">No printing companies found in {city.city}.</p>
            <a href={`/state/${stateSlug}`} className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
              View all in {city.stateName} &rarr;
            </a>
          </div>
        )}

        {/* Back to state */}
        <div className="mt-10 pt-6 border-t border-surface-200">
          <a href={`/state/${stateSlug}`} className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            &larr; All printing companies in {city.stateName}
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
            '@type': 'ItemList',
            name: `Printing Services in ${city.city}, ${city.stateAbbr}`,
            numberOfItems: providers.length,
            itemListElement: providers.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'LocalBusiness',
                name: p.name,
                url: `https://directory.dtlaprint.com/provider/${p.slug}`,
                address: { '@type': 'PostalAddress', addressLocality: city.city, addressRegion: city.stateAbbr },
                aggregateRating: p.rating > 0 ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount } : undefined,
              },
            })),
          }),
        }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.dtlaprint.com' },
              { '@type': 'ListItem', position: 2, name: city.stateName, item: `https://directory.dtlaprint.com/state/${stateSlug}` },
              { '@type': 'ListItem', position: 3, name: city.city, item: `https://directory.dtlaprint.com/city/${slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
