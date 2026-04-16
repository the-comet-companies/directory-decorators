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

export async function getAllProviders(): Promise<Provider[]> {
  // Supabase default limit is 1000, so paginate through all rows
  const all: Provider[] = [];
  const PAGE_SIZE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data.map(providerFromRow));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

export async function getProviders(filters: Partial<FilterState>): Promise<{ providers: Provider[]; total: number }> {
  // For complex search with relevance scoring, we load and score in JS
  // This keeps the same relevance algorithm as before
  let results = await getAllProviders();

  // Search with relevance scoring
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);

    results = results
      .map(p => {
        let score = 0;
        const name = (p.name || '').toLowerCase();
        const city = (p.city || '').toLowerCase();
        const neighborhood = (p.neighborhood || '').toLowerCase();
        const description = (p.description || '').toLowerCase();
        const state = ((p.serviceArea || [])[1] || '').toLowerCase();
        const srvcs = (p.servicesOffered || []).map(s => (s || '').toLowerCase());
        const products = (p.productCategories || []).map(c => (c || '').toLowerCase());

        if (name === q) score += 100;
        else if (name.startsWith(q)) score += 80;
        else if (name.includes(q)) score += 60;
        else if (words.every(w => name.includes(w))) score += 50;

        if (city === q || city.includes(q)) score += 40;
        if (state === q) score += 35;
        if (neighborhood.includes(q)) score += 30;

        if (srvcs.some(s => s === q)) score += 25;
        if (srvcs.some(s => s.includes(q))) score += 20;

        if (products.some(c => c === q)) score += 15;
        if (products.some(c => c.includes(q))) score += 10;

        if (description.includes(q)) score += 5;

        if (words.length > 1) {
          for (const w of words) {
            if (name.includes(w)) score += 8;
            if (city.includes(w)) score += 5;
            if (srvcs.some(s => s.includes(w))) score += 3;
            if (products.some(c => c.includes(w))) score += 2;
          }
        }

        score += (p.rating || 0) * 0.5;

        return { provider: p, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.provider);
  }

  // Service type
  if (filters.serviceType?.length) {
    results = results.filter(p =>
      filters.serviceType!.some(s => (p.servicesOffered || []).includes(s))
    );
  }

  // Screen printing subtype
  if (filters.screenPrintingType?.length) {
    results = results.filter(p =>
      filters.screenPrintingType!.some(t => (p.printingMethods || []).includes(t))
    );
  }

  // Product type
  if (filters.productType?.length) {
    results = results.filter(p =>
      filters.productType!.some(pt => (p.productCategories || []).includes(pt))
    );
  }

  // MOQ
  if (filters.moq) {
    const moqMap: Record<string, number> = { '1': 1, '12': 12, '24': 24, '48': 48, '100': 100, '500': 500 };
    const maxMoq = moqMap[filters.moq];
    if (maxMoq !== undefined) {
      results = results.filter(p => p.moq <= maxMoq);
    }
  }

  // Turnaround
  if (filters.turnaround) {
    const turnaroundMap: Record<string, number> = { '1': 1, '3': 3, '5': 5, '7': 7, '14': 14 };
    const maxDays = turnaroundMap[filters.turnaround];
    if (maxDays !== undefined) {
      results = results.filter(p => p.turnaroundDays <= maxDays);
    }
  }

  if (filters.rushAvailable === true) results = results.filter(p => p.rushAvailable);
  if (filters.ecoFriendly === true) results = results.filter(p => p.ecoFriendly);

  if (filters.fulfillment?.length) {
    results = results.filter(p => {
      if (filters.fulfillment!.includes('Pickup') && !p.pickup) return false;
      if (filters.fulfillment!.includes('Delivery') && !p.delivery) return false;
      if (filters.fulfillment!.includes('Nationwide Shipping') && !p.nationwideShipping) return false;
      return true;
    });
  }

  if (filters.bulkOrders === true) results = results.filter(p => p.bulkOrders);
  if (filters.smallBatch === true) results = results.filter(p => p.smallBatch);
  if (filters.customDesign === true) results = results.filter(p => p.customDesign);
  if (filters.onlineOrdering === true) results = results.filter(p => p.onlineOrdering);
  if (filters.nationwideShipping === true) results = results.filter(p => p.nationwideShipping);

  if (filters.rating) {
    const minRating = parseFloat(filters.rating);
    results = results.filter(p => p.rating >= minRating);
  }

  // Sort
  const sort = (filters.sort || 'recommended') as SortOption;
  const isSearching = !!(filters.search?.trim());
  const hasImages = (p: Provider) => !!(p.coverImage || (p.galleryImages && p.galleryImages.length > 0));
  switch (sort) {
    case 'recommended':
      if (!isSearching) {
        // Priority: featured > has images > rating
        results.sort((a, b) =>
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
          (hasImages(b) ? 1 : 0) - (hasImages(a) ? 1 : 0) ||
          b.rating - a.rating
        );
      }
      break;
    case 'fastest':
      results.sort((a, b) => a.turnaroundDays - b.turnaroundDays);
      break;
    case 'lowest-moq':
      results.sort((a, b) => a.moq - b.moq);
      break;
    case 'highest-rated':
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'nearest':
      const center = { lat: 39.5, lng: -98.35 };
      results.sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.coordinates.lat - center.lat, 2) + Math.pow(a.coordinates.lng - center.lng, 2));
        const distB = Math.sqrt(Math.pow(b.coordinates.lat - center.lat, 2) + Math.pow(b.coordinates.lng - center.lng, 2));
        return distA - distB;
      });
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Bubble verified (claimed) businesses to the top — but don't reshuffle when searching
  if (!isSearching) {
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
  }

  // Pin DTLA Print as #1 (always)
  const DTLA_SLUG = 'dtla-print-los-angeles-ca';
  const dtlaIndex = results.findIndex(p => p.slug === DTLA_SLUG);
  if (dtlaIndex > 0) {
    const [dtla] = results.splice(dtlaIndex, 1);
    results.unshift(dtla);
  } else if (dtlaIndex === -1) {
    const { data: dtlaRow } = await supabase.from('companies').select('*').eq('slug', DTLA_SLUG).maybeSingle();
    if (dtlaRow) results.unshift(providerFromRow(dtlaRow));
  }

  const total = results.length;
  const page = filters.page || 1;
  const perPage = 8;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return { providers: paginated, total };
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

  // Pin DTLA Print as #1
  const DTLA_SLUG = 'dtla-print-los-angeles-ca';
  const dtlaIndex = results.findIndex(p => p.slug === DTLA_SLUG);
  if (dtlaIndex > 0) {
    const [dtla] = results.splice(dtlaIndex, 1);
    results.unshift(dtla);
  }

  return results.slice(0, 60);
}
