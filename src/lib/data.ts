import { unstable_cache } from 'next/cache';
import { Provider, FilterState, SortOption } from './types';
import { services, neighborhoods, productCategories } from './seed-data';
import { supabase } from './supabase';
import { getClaimedSlugs } from './db';

const SCREEN_PRINTING_TYPES = [
  'Puff Printing',
  'Plastisol Printing',
  'Waterbased Printing',
  'Flocking Printing',
  '3M Reflective Printing',
  'Headwear Printing',
  'High Density Printing',
  'Foil Printing',
];

// ─── Row mapper ────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */
function providerFromRow(row: any): Provider {
  return {
    id: row.id,
    name: row.name || '',
    slug: row.slug || '',
    description: row.description || '',
    shortSummary: row.short_summary || '',
    address: row.address || '',
    neighborhood: row.neighborhood || '',
    city: row.city || '',
    serviceArea: row.service_area || [],
    coordinates: { lat: row.lat || 0, lng: row.lng || 0 },
    phone: row.phone || '',
    email: row.email || '',
    website: row.website || '',
    servicesOffered: row.services_offered || [],
    productCategories: row.product_categories || [],
    printingMethods: row.printing_methods || [],
    moq: row.moq || 1,
    turnaroundDays: row.turnaround_days || 7,
    rushAvailable: !!row.rush_available,
    startingPrice: row.starting_price,
    pricingTiers: row.pricing_tiers || [],
    pickup: !!row.pickup,
    delivery: !!row.delivery,
    sustainabilityTags: row.sustainability_tags || [],
    galleryImages: row.gallery_images || [],
    coverImage: row.cover_image || '',
    logoImage: row.logo_image || '',
    featured: !!row.featured,
    rating: row.rating || 0,
    reviewCount: row.review_count || 0,
    reviews: row.reviews || [],
    faqs: row.faqs || [],
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    createdAt: row.created_at || '',
    customizationMethods: row.customization_methods || [],
    ecoFriendly: !!row.eco_friendly,
    finishingOptions: row.finishing_options || [],
    sameDayPrinting: !!row.same_day_printing,
    bulkOrders: !!row.bulk_orders,
    smallBatch: !!row.small_batch,
    customDesign: !!row.custom_design,
    onlineOrdering: !!row.online_ordering,
    freeQuotes: !!row.free_quotes,
    nationwideShipping: !!row.nationwide_shipping,
    contractPrinting: !!row.contract_printing,
    dropshipping: !!row.dropshipping,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Queries ───────────────────────────────────────────────────────────────

// Cached fetch — paginates through Supabase once per hour, then serves from cache
// so pagination navigation (page=2, 3, 4...) doesn't re-hit the DB each click.
const fetchProvidersCached = unstable_cache(
  async (minReviews: number): Promise<Provider[]> => {
    const all: Provider[] = [];
    const PAGE_SIZE = 1000;
    let from = 0;
    while (true) {
      let query = supabase.from('companies').select('*').range(from, from + PAGE_SIZE - 1);
      if (minReviews > 0) query = query.gte('review_count', minReviews);
      const { data, error } = await query;
      if (error || !data || data.length === 0) break;
      all.push(...data.map(providerFromRow));
      if (data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }
    return all;
  },
  ['providers-by-min-reviews'],
  { revalidate: 3600, tags: ['providers'] }
);

export async function getAllProviders(options?: { minReviews?: number }): Promise<Provider[]> {
  const minReviews = options?.minReviews || 0;
  const all = await fetchProvidersCached(minReviews);

  // Always include verified/claimed listings regardless of review count
  if (minReviews > 0) {
    const claimedSlugs = await getClaimedSlugs();
    const existingSlugs = new Set(all.map(p => p.slug));
    const missingClaimed = Array.from(claimedSlugs).filter(s => !existingSlugs.has(s));
    if (missingClaimed.length > 0) {
      const { data: claimedData } = await supabase
        .from('companies')
        .select('*')
        .in('slug', missingClaimed);
      if (claimedData) return [...all, ...claimedData.map(providerFromRow)];
    }
  }

  return all;
}

export async function getProviders(filters: Partial<FilterState>): Promise<{ providers: Provider[]; total: number }> {
  // DB-level pagination — only 8 rows leave Supabase per request, not 8k.
  const page = filters.page || 1;
  const perPage = 8;
  const offset = (page - 1) * perPage;
  const sort = (filters.sort || 'recommended') as SortOption;
  const isSearching = !!(filters.search?.trim());

  let query = supabase
    .from('companies')
    .select('*', { count: 'estimated' })
    .gte('review_count', 20);

  // Search — simple ilike across name/city/description
  if (filters.search) {
    const q = filters.search.trim().replace(/[%_]/g, ''); // strip wildcards
    query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // JSON array contains — for OR across multiple values, use .or() with cs (contains string)
  const jsonAnyContains = (col: string, values: string[]) =>
    values.map(v => `${col}.cs.${JSON.stringify([v])}`).join(',');

  if (filters.serviceType?.length) query = query.or(jsonAnyContains('services_offered', filters.serviceType));
  if (filters.screenPrintingType?.length) query = query.or(jsonAnyContains('printing_methods', filters.screenPrintingType));
  if (filters.productType?.length) query = query.or(jsonAnyContains('product_categories', filters.productType));

  // Numeric thresholds
  if (filters.moq) {
    const moqMap: Record<string, number> = { '1': 1, '12': 12, '24': 24, '48': 48, '100': 100, '500': 500 };
    const maxMoq = moqMap[filters.moq];
    if (maxMoq !== undefined) query = query.lte('moq', maxMoq);
  }
  if (filters.turnaround) {
    const turnaroundMap: Record<string, number> = { '1': 1, '3': 3, '5': 5, '7': 7, '14': 14 };
    const maxDays = turnaroundMap[filters.turnaround];
    if (maxDays !== undefined) query = query.lte('turnaround_days', maxDays);
  }
  if (filters.rating) query = query.gte('rating', parseFloat(filters.rating));

  // Booleans
  if (filters.rushAvailable === true) query = query.eq('rush_available', true);
  if (filters.ecoFriendly === true) query = query.eq('eco_friendly', true);
  if (filters.bulkOrders === true) query = query.eq('bulk_orders', true);
  if (filters.smallBatch === true) query = query.eq('small_batch', true);
  if (filters.customDesign === true) query = query.eq('custom_design', true);
  if (filters.onlineOrdering === true) query = query.eq('online_ordering', true);
  if (filters.nationwideShipping === true) query = query.eq('nationwide_shipping', true);
  if (filters.fulfillment?.length) {
    if (filters.fulfillment.includes('Pickup')) query = query.eq('pickup', true);
    if (filters.fulfillment.includes('Delivery')) query = query.eq('delivery', true);
    if (filters.fulfillment.includes('Nationwide Shipping')) query = query.eq('nationwide_shipping', true);
  }

  // Sort
  switch (sort) {
    case 'fastest':
      query = query.order('turnaround_days', { ascending: true });
      break;
    case 'lowest-moq':
      query = query.order('moq', { ascending: true });
      break;
    case 'highest-rated':
      query = query.order('rating', { ascending: false }).order('review_count', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'recommended':
    default:
      query = query.order('featured', { ascending: false }).order('rating', { ascending: false }).order('review_count', { ascending: false });
  }

  query = query.range(offset, offset + perPage - 1);

  const { data, error, count } = await query;
  if (error || !data) return { providers: [], total: 0 };

  let providers = data.map(providerFromRow);
  const total = count || 0;

  // Page 1 curation: bubble verified (claimed) businesses within the page (no search)
  if (page === 1 && !isSearching) {
    const claimedSlugs = await getClaimedSlugs();
    if (claimedSlugs.size > 0) {
      const verified = providers.filter(p => claimedSlugs.has(p.slug));
      const unverified = providers.filter(p => !claimedSlugs.has(p.slug));
      providers = [...verified, ...unverified];
    }
  }

  return { providers, total };
}

export async function getFeaturedProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('featured', true);
  if (error || !data) return [];
  return data.map(providerFromRow);
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return providerFromRow(data);
}

export async function getRelatedProviders(slug: string, limit = 3): Promise<Provider[]> {
  const current = await getProviderBySlug(slug);
  if (!current) return [];

  // Get providers in same city or with similar services
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .neq('slug', slug)
    .or(`city.eq.${current.city},state.eq.${(current.serviceArea || [])[1] || ''}`)
    .limit(50);

  if (error || !data) return [];

  return data
    .map(providerFromRow)
    .map(p => ({
      provider: p,
      score: p.servicesOffered.filter(s => current.servicesOffered.includes(s)).length +
             (p.neighborhood === current.neighborhood ? 2 : 0) +
             (p.city === current.city ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.provider);
}

export function getFilterOptions() {
  return {
    services: services.map(s => s.name),
    screenPrintingTypes: SCREEN_PRINTING_TYPES,
    productCategories: productCategories.map(c => c.name),
    neighborhoods: neighborhoods.map(n => n.name),
    moqOptions: [
      { label: 'No minimum', value: '1' },
      { label: '12 or less', value: '12' },
      { label: '24 or less', value: '24' },
      { label: '48 or less', value: '48' },
      { label: '100 or less', value: '100' },
      { label: '500 or less', value: '500' },
    ],
    turnaroundOptions: [
      { label: 'Same day', value: '1' },
      { label: '3 days or less', value: '3' },
      { label: '5 days or less', value: '5' },
      { label: '1 week or less', value: '7' },
      { label: '2 weeks or less', value: '14' },
    ],
    ratingOptions: [
      { label: '4.5+ stars', value: '4.5' },
      { label: '4.0+ stars', value: '4.0' },
      { label: '3.5+ stars', value: '3.5' },
    ],
    sortOptions: [
      { label: 'Recommended', value: 'recommended' },
      { label: 'Fastest turnaround', value: 'fastest' },
      { label: 'Lowest minimum order', value: 'lowest-moq' },
      { label: 'Highest rated', value: 'highest-rated' },
      { label: 'Recently added', value: 'newest' },
    ],
  };
}

export async function getAllProviderSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('slug')
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    slugs.push(...data.map(r => r.slug));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return slugs;
}

// Strong providers only — for sitemap. Filters to listings with 20+ reviews (signal of
// real activity) or verified by owner, so Google spends crawl budget on quality pages.
export async function getStrongProviderSlugs(): Promise<string[]> {
  const claimedSlugs = await getClaimedSlugs();
  const slugs = new Set<string>();
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('slug')
      .gte('review_count', 20)
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    for (const r of data) slugs.add(r.slug);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  for (const slug of claimedSlugs) slugs.add(slug);
  return Array.from(slugs);
}

export async function getProvidersForService(filterValue: string): Promise<Provider[]> {
  const all = await getAllProviders();

  let results = all
    .filter(p => (p.servicesOffered || []).some(s => s?.toLowerCase() === filterValue.toLowerCase()));

  results.sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log((a.reviewCount || 0) + 1);
    const scoreB = (b.rating || 0) * Math.log((b.reviewCount || 0) + 1);
    return scoreB - scoreA;
  });

  // Bubble verified businesses to the top
  const claimedSlugs = await getClaimedSlugs();
  if (claimedSlugs.size > 0) {
    const verified: Provider[] = [];
    const unverified: Provider[] = [];
    for (const p of results) {
      if (claimedSlugs.has(p.slug)) verified.push(p);
      else unverified.push(p);
    }
    results = [...verified, ...unverified];
  }

  return results.slice(0, 60);
}
