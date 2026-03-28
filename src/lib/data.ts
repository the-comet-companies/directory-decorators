import { Provider, FilterState, SortOption } from './types';
import { providers as seedProviders, services, neighborhoods, productCategories } from './seed-data';
import fs from 'fs';
import path from 'path';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadAddedCompanies(): Provider[] {
  try {
    const file = path.join(process.cwd(), 'companies', 'added-companies.json');
    if (!fs.existsSync(file)) return [];
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return (raw as Record<string, unknown>[]).map((c) => ({
      id: String(c.id ?? ''),
      name: String(c.name ?? ''),
      slug: slugify(`${String(c.name ?? '')}-${String(c.city ?? '')}-${String(c.state ?? '')}`),
      description: String(c.description ?? ''),
      shortSummary: String(c.description ?? '').slice(0, 120),
      address: String(c.address ?? ''),
      neighborhood: String(c.city ?? ''),
      city: String(c.city ?? ''),
      serviceArea: [String(c.city ?? ''), String(c.state ?? '')].filter(Boolean),
      coordinates: { lat: 0, lng: 0 },
      phone: String(c.phone ?? ''),
      email: String(c.email ?? ''),
      website: String(c.website ?? ''),
      servicesOffered: Array.isArray(c.printingMethods) ? c.printingMethods as string[] : [],
      productCategories: [],
      printingMethods: Array.isArray(c.printingMethods) ? c.printingMethods as string[] : [],
      moq: Number(c.moq ?? 0),
      turnaroundDays: Number(c.turnaroundDays ?? 0),
      rushAvailable: Boolean(c.rushAvailable),
      startingPrice: c.startingPrice != null ? Number(c.startingPrice) : null,
      pricingTiers: [],
      pickup: Boolean(c.pickup),
      delivery: Boolean(c.delivery),
      sustainabilityTags: [],
      galleryImages: [],
      coverImage: String(c.coverImage ?? ''),
      featured: false,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      faqs: [],
      seoTitle: String(c.name ?? ''),
      seoDescription: String(c.description ?? ''),
      createdAt: String(c.submittedAt ?? new Date().toISOString()),
      customizationMethods: [],
      ecoFriendly: false,
      finishingOptions: [],
    }));
  } catch {
    return [];
  }
}

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

export function getAllProviders(): Provider[] {
  return [...seedProviders, ...loadAddedCompanies()];
}

export function getProviders(filters: Partial<FilterState>): { providers: Provider[]; total: number } {
  let results = [...seedProviders, ...loadAddedCompanies()];

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.servicesOffered.some(s => s.toLowerCase().includes(q)) ||
      p.productCategories.some(c => c.toLowerCase().includes(q)) ||
      p.neighborhood.toLowerCase().includes(q)
    );
  }

  // Service type
  if (filters.serviceType?.length) {
    results = results.filter(p =>
      filters.serviceType!.some(s => p.servicesOffered.includes(s))
    );
  }

  // Screen printing subtype (filter on printingMethods)
  if (filters.screenPrintingType?.length) {
    results = results.filter(p =>
      filters.screenPrintingType!.some(t => p.printingMethods.includes(t))
    );
  }

  // Product type
  if (filters.productType?.length) {
    results = results.filter(p =>
      filters.productType!.some(pt => p.productCategories.includes(pt))
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

  // Rush available
  if (filters.rushAvailable === true) {
    results = results.filter(p => p.rushAvailable);
  }

  // Eco-friendly
  if (filters.ecoFriendly === true) {
    results = results.filter(p => p.ecoFriendly);
  }

  // Fulfillment (pickup / delivery / nationwide shipping)
  if (filters.fulfillment?.length) {
    results = results.filter(p => {
      if (filters.fulfillment!.includes('Pickup') && !p.pickup) return false;
      if (filters.fulfillment!.includes('Delivery') && !p.delivery) return false;
      if (filters.fulfillment!.includes('Nationwide Shipping') && !p.nationwideShipping) return false;
      return true;
    });
  }

  // Feature filters
  if (filters.bulkOrders === true) {
    results = results.filter(p => p.bulkOrders);
  }
  if (filters.smallBatch === true) {
    results = results.filter(p => p.smallBatch);
  }
  if (filters.customDesign === true) {
    results = results.filter(p => p.customDesign);
  }
  if (filters.onlineOrdering === true) {
    results = results.filter(p => p.onlineOrdering);
  }
  if (filters.nationwideShipping === true) {
    results = results.filter(p => p.nationwideShipping);
  }

  // Rating
  if (filters.rating) {
    const minRating = parseFloat(filters.rating);
    results = results.filter(p => p.rating >= minRating);
  }

  // Sort
  const sort = (filters.sort || 'recommended') as SortOption;
  switch (sort) {
    case 'recommended':
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
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

  // Always pin DTLA Print as #1 — this is the site's primary business goal
  const DTLA_SLUG = 'dtla-print-los-angeles-ca';
  const dtlaIndex = results.findIndex(p => p.slug === DTLA_SLUG);
  if (dtlaIndex > 0) {
    const [dtla] = results.splice(dtlaIndex, 1);
    results.unshift(dtla);
  } else if (dtlaIndex === -1) {
    const dtla = seedProviders.find(p => p.slug === DTLA_SLUG);
    if (dtla) results.unshift(dtla);
  }

  const total = results.length;
  const page = filters.page || 1;
  const perPage = 8;
  const paginated = results.slice((page - 1) * perPage, page * perPage);

  return { providers: paginated, total };
}

export function getFeaturedProviders(): Provider[] {
  return seedProviders.filter(p => p.featured);
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return seedProviders.find(p => p.slug === slug);
}

export function getRelatedProviders(slug: string, limit = 3): Provider[] {
  const current = getProviderBySlug(slug);
  if (!current) return [];

  return seedProviders
    .filter(p => p.slug !== slug)
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

export function getAllProviderSlugs(): string[] {
  return seedProviders.map(p => p.slug);
}
