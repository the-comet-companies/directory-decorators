export const revalidate = 3600;

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProviders, getFeaturedProviders, getFilterOptions } from '@/lib/data';
import { getClaimedSlugs } from '@/lib/db';
import SearchHeader from '@/components/SearchHeader';
import FilterBar from '@/components/FilterBar';
import MobileFilterDrawer from '@/components/MobileFilterDrawer';
import ResultsGrid from '@/components/ResultsGrid';
import FeaturedProviders from '@/components/FeaturedProviders';
import Pagination from '@/components/Pagination';
import SEOContentBlock from '@/components/SEOContentBlock';
import Footer from '@/components/Footer';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function buildDynamicTitle(params: Record<string, string | string[] | undefined>): string {
  const serviceType = Array.isArray(params.serviceType)
    ? params.serviceType[0]
    : params.serviceType || ''
  const search = (params.search as string) || ''

  const parts: string[] = []

  if (serviceType) {
    parts.push(serviceType.replace(/\+/g, ' '))
  } else if (search) {
    parts.push(search)
  }

  if (parts.length > 0) {
    return `${parts.join(' ')} — Compare Top Providers 2026 | Print Services Hub USA`
  }

  return 'Find the Best Printing Companies Near You | Compare 15,000+ Providers 2026'
}

function buildDynamicDescription(params: Record<string, string | string[] | undefined>): string {
  const serviceType = Array.isArray(params.serviceType)
    ? params.serviceType[0]
    : params.serviceType || ''
  const search = (params.search as string) || ''

  if (serviceType) {
    const name = serviceType.replace(/\+/g, ' ')
    return `Compare top-rated ${name.toLowerCase()} companies. Find the best ${name.toLowerCase()} providers near you with reviews, pricing, and turnaround times. Updated 2026.`
  }

  if (search) {
    return `Search results for "${search}" — compare top-rated printing companies with reviews, pricing, and turnaround times. Updated 2026.`
  }

  return 'Compare 15,000+ top-rated printing companies across all 50 states. Find the best screen printing, DTG, embroidery, and custom apparel providers near you. Updated 2026.'
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const title = buildDynamicTitle(params)
  const description = buildDynamicDescription(params)

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterOptions = getFilterOptions();

  const activeFilters: Record<string, string | string[]> = {
    serviceType: normalizeArray(params.serviceType),
    screenPrintingType: normalizeArray(params.screenPrintingType),
    productType: normalizeArray(params.productType),
    moq: (params.moq as string) || '',
    turnaround: (params.turnaround as string) || '',
    rushAvailable: (params.rushAvailable as string) || '',
    priceRange: (params.priceRange as string) || '',
    ecoFriendly: (params.ecoFriendly as string) || '',
    fulfillment: normalizeArray(params.fulfillment),
    rating: (params.rating as string) || '',
    bulkOrders: (params.bulkOrders as string) || '',
    smallBatch: (params.smallBatch as string) || '',
    customDesign: (params.customDesign as string) || '',
    onlineOrdering: (params.onlineOrdering as string) || '',
    nationwideShipping: (params.nationwideShipping as string) || '',
  };

  const currentSort = (params.sort as string) || 'recommended';
  const currentSearch = (params.search as string) || '';
  const currentPage = parseInt((params.page as string) || '1', 10);

  const { providers, total } = getProviders({
    search: currentSearch,
    serviceType: activeFilters.serviceType as string[],
    screenPrintingType: activeFilters.screenPrintingType as string[],
    productType: activeFilters.productType as string[],
    moq: activeFilters.moq as string,
    turnaround: activeFilters.turnaround as string,
    rushAvailable: activeFilters.rushAvailable === 'true' ? true : null,
    priceRange: activeFilters.priceRange as string,
    ecoFriendly: activeFilters.ecoFriendly === 'true' ? true : null,
    fulfillment: activeFilters.fulfillment as string[],
    rating: activeFilters.rating as string,
    bulkOrders: activeFilters.bulkOrders === 'true' ? true : null,
    smallBatch: activeFilters.smallBatch === 'true' ? true : null,
    customDesign: activeFilters.customDesign === 'true' ? true : null,
    onlineOrdering: activeFilters.onlineOrdering === 'true' ? true : null,
    nationwideShipping: activeFilters.nationwideShipping === 'true' ? true : null,
    sort: currentSort,
    page: currentPage,
  });

  const featured = getFeaturedProviders();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Search header */}
        <Suspense fallback={null}>
          <SearchHeader
            sortOptions={filterOptions.sortOptions}
            currentSort={currentSort}
            currentSearch={currentSearch}
          />
        </Suspense>

        {/* Horizontal filter bar (desktop) */}
        <div className="hidden sm:block">
          <Suspense fallback={null}>
            <FilterBar
              filterOptions={filterOptions}
              activeFilters={activeFilters}
            />
          </Suspense>
        </div>

        {/* Mobile filter button */}
        <div className="mb-4 sm:hidden">
          <Suspense fallback={null}>
            <MobileFilterDrawer
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              resultCount={total}
            />
          </Suspense>
        </div>

        {/* Featured providers */}
        {currentPage === 1 && !currentSearch && <FeaturedProviders providers={featured} />}

        {/* Results - full width */}
        <ResultsGrid providers={providers} total={total} claimedSlugs={[...(await getClaimedSlugs())]} />
        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalResults={total} />
        </Suspense>

        {/* SEO content */}
        <SEOContentBlock />
      </div>
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Printing Services in the United States',
            description: 'Directory of custom printing services across the United States',
            numberOfItems: total,
            itemListElement: providers.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'LocalBusiness',
                name: p.name,
                description: p.shortSummary,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: p.address,
                  addressLocality: p.city,
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: p.rating,
                  reviewCount: p.reviewCount,
                },
                url: `/provider/${p.slug}`,
              },
            })),
          }),
        }}
      />
    </>
  );
}

function normalizeArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
