import { Provider } from './types';
import { supabase } from './supabase';
import { getClaimedSlugs } from './db';

// US state abbreviation → full name
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  AS: 'American Samoa', DC: 'District of Columbia', GU: 'Guam', PR: 'Puerto Rico',
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function providerFromRow(row: any): Provider {
  return {
    id: row.id, name: row.name || '', slug: row.slug || '',
    description: row.description || '', shortSummary: row.short_summary || '',
    address: row.address || '', addressLine2: row.address_line2 || '',
    neighborhood: row.neighborhood || '',
    city: row.city || '', state: row.state || '', zip: row.zip || '',
    serviceArea: row.service_area || [],
    coordinates: { lat: row.lat || 0, lng: row.lng || 0 },
    phone: row.phone || '', email: row.email || '', website: row.website || '',
    servicesOffered: row.services_offered || [], productCategories: row.product_categories || [],
    printingMethods: row.printing_methods || [], moq: row.moq || 1,
    moqByService: row.moq_by_service || {},
    turnaroundDays: row.turnaround_days || 7,
    turnaroundMinDays: row.turnaround_min_days ?? null,
    turnaroundByService: row.turnaround_by_service || {},
    rushAvailable: !!row.rush_available,
    startingPrice: row.starting_price, pricingTiers: row.pricing_tiers || [],
    pickup: !!row.pickup, delivery: !!row.delivery,
    sustainabilityTags: row.sustainability_tags || [],
    galleryImages: row.gallery_images || [], coverImage: row.cover_image || '',
    logoImage: row.logo_image || '', featured: !!row.featured,
    rating: row.rating || 0, reviewCount: row.review_count || 0,
    reviews: row.reviews || [], faqs: row.faqs || [],
    seoTitle: row.seo_title || '', seoDescription: row.seo_description || '',
    createdAt: row.created_at || '', customizationMethods: row.customization_methods || [],
    ecoFriendly: !!row.eco_friendly, finishingOptions: row.finishing_options || [],
    sameDayPrinting: !!row.same_day_printing, bulkOrders: !!row.bulk_orders,
    smallBatch: !!row.small_batch, customDesign: !!row.custom_design,
    onlineOrdering: !!row.online_ordering, freeQuotes: !!row.free_quotes,
    nationwideShipping: !!row.nationwide_shipping,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function getStateName(abbr: string): string {
  return STATE_NAMES[abbr.toUpperCase()] || abbr;
}

export function getStateSlug(abbr: string): string {
  return slugify(getStateName(abbr));
}

export function getCitySlug(city: string, stateAbbr: string): string {
  return slugify(`${city}-${stateAbbr}`);
}

interface StateInfo {
  abbr: string;
  name: string;
  slug: string;
  count: number;
  cities: { name: string; slug: string; count: number }[];
}

export async function getAllStates(): Promise<StateInfo[]> {
  // Query distinct state + city counts from Supabase (paginated — default limit is 1000)
  const PAGE_SIZE = 1000;
  const rows: { state: string | null; city: string | null }[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('state, city')
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  if (rows.length === 0) return [];

  const stateMap = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const abbr = row.state || '';
    if (!abbr) continue;
    if (!stateMap.has(abbr)) stateMap.set(abbr, new Map());
    const cities = stateMap.get(abbr)!;
    const city = row.city || '';
    cities.set(city, (cities.get(city) || 0) + 1);
  }

  return Array.from(stateMap.entries())
    .map(([abbr, cities]) => ({
      abbr,
      name: getStateName(abbr),
      slug: getStateSlug(abbr),
      count: Array.from(cities.values()).reduce((a, b) => a + b, 0),
      cities: Array.from(cities.entries())
        .map(([name, count]) => ({
          name,
          slug: getCitySlug(name, abbr),
          count,
        }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getStateBySlug(slug: string): Promise<StateInfo | undefined> {
  const states = await getAllStates();
  return states.find(s => s.slug === slug);
}

export async function getProvidersForState(stateAbbr: string): Promise<Provider[]> {
  const PAGE_SIZE = 1000;
  let all: Provider[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('state', stateAbbr)
      .range(from, from + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data.map(providerFromRow));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  all.sort((a, b) => b.rating - a.rating);

  // Bubble verified businesses to the top
  const claimedSlugs = await getClaimedSlugs();
  if (claimedSlugs.size > 0) {
    const verified: Provider[] = [];
    const unverified: Provider[] = [];
    for (const p of all) {
      if (claimedSlugs.has(p.slug)) verified.push(p);
      else unverified.push(p);
    }
    all = [...verified, ...unverified];
  }


  return all;
}

export async function getProvidersForCity(city: string, stateAbbr: string): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('city', city)
    .eq('state', stateAbbr);
  if (error || !data) return [];

  let results = data.map(providerFromRow).sort((a, b) => b.rating - a.rating);

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

  return results;
}

export async function getCityBySlug(slug: string): Promise<{ city: string; stateAbbr: string; stateName: string; slug: string } | undefined> {
  const states = await getAllStates();
  for (const state of states) {
    for (const city of state.cities) {
      if (city.slug === slug) {
        return { city: city.name, stateAbbr: state.abbr, stateName: state.name, slug: city.slug };
      }
    }
  }
  return undefined;
}

export async function getAllStateSlugs(): Promise<string[]> {
  const states = await getAllStates();
  return states.map(s => s.slug);
}

export async function getAllCitySlugs(): Promise<string[]> {
  const states = await getAllStates();
  const slugs: string[] = [];
  for (const state of states) {
    for (const city of state.cities) {
      slugs.push(city.slug);
    }
  }
  return slugs;
}
