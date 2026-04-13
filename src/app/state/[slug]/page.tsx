import { notFound } from 'next/navigation';
import { getStateBySlug, getProvidersForState, getAllStateSlugs } from '@/lib/geo';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ProviderCard from '@/components/ProviderCard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getAllStateSlugs()).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) return {};
  const title = `Top 10 Best Printing Companies in ${state.name} — Updated 2026`;
  const description = `Compare the top ${state.count}+ printing companies in ${state.name}. Find the best screen printing, DTG, embroidery, and custom apparel providers near you. Updated 2026.`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    alternates: { canonical: `https://directory.shoptitan.app/state/${slug}` },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) notFound();

  const providers = await getProvidersForState(state.abbr);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">{state.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">
            Printing Services in {state.name}
          </h1>
          <p className="text-surface-500 mt-2">
            Browse <span className="font-semibold text-surface-700">{state.count}</span> printing{' '}
            {state.count === 1 ? 'company' : 'companies'} across{' '}
            <span className="font-semibold text-surface-700">{state.cities.length}</span>{' '}
            {state.cities.length === 1 ? 'city' : 'cities'} in {state.name}.
          </p>
        </div>

        {/* Cities */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Cities in {state.name}</h2>
          <div className="flex flex-wrap gap-2">
            {state.cities.map(city => (
              <a
                key={city.slug}
                href={`/city/${city.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-3.5 py-1.5 text-sm font-medium text-surface-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {city.name}
                <span className="text-xs text-surface-400">({city.count})</span>
              </a>
            ))}
          </div>
        </section>

        {/* Provider grid */}
        <section>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            All Printing Companies in {state.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providers.map((p, i) => (
              <ProviderCard key={p.id} provider={p} index={i} />
            ))}
          </div>
        </section>
      </div>

      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Printing Services in ${state.name}`,
            description: `Top printing companies in ${state.name}`,
            numberOfItems: providers.length,
            itemListElement: providers.slice(0, 20).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'LocalBusiness',
                name: p.name,
                url: `https://directory.shoptitan.app/provider/${p.slug}`,
                address: { '@type': 'PostalAddress', addressLocality: p.city, addressRegion: state.abbr },
                aggregateRating: p.rating > 0 ? { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviewCount } : undefined,
              },
            })),
          }),
        }}
      />
    </>
  );
}
