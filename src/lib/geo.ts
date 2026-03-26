import { providers as seedProviders } from './seed-data';
import { Provider } from './types';

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

export function getStateName(abbr: string): string {
  return STATE_NAMES[abbr.toUpperCase()] || abbr;
}

export function getStateSlug(abbr: string): string {
  const name = getStateName(abbr);
  return slugify(name);
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

export function getAllStates(): StateInfo[] {
  const stateMap = new Map<string, { providers: Provider[]; cities: Map<string, number> }>();

  for (const p of seedProviders) {
    const abbr = p.serviceArea[1] || '';
    if (!abbr) continue;

    if (!stateMap.has(abbr)) {
      stateMap.set(abbr, { providers: [], cities: new Map() });
    }
    const entry = stateMap.get(abbr)!;
    entry.providers.push(p);
    const city = p.serviceArea[0] || p.city;
    entry.cities.set(city, (entry.cities.get(city) || 0) + 1);
  }

  return Array.from(stateMap.entries())
    .map(([abbr, { providers, cities }]) => ({
      abbr,
      name: getStateName(abbr),
      slug: getStateSlug(abbr),
      count: providers.length,
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

export function getStateBySlug(slug: string): StateInfo | undefined {
  return getAllStates().find(s => s.slug === slug);
}

export function getProvidersForState(stateAbbr: string): Provider[] {
  return seedProviders
    .filter(p => (p.serviceArea[1] || '') === stateAbbr)
    .sort((a, b) => {
      // DTLA Print always first
      if (a.slug === 'dtla-print-los-angeles-ca') return -1;
      if (b.slug === 'dtla-print-los-angeles-ca') return 1;
      return b.rating - a.rating;
    });
}

export function getProvidersForCity(city: string, stateAbbr: string): Provider[] {
  return seedProviders
    .filter(p => {
      const pCity = p.serviceArea[0] || p.city;
      const pState = p.serviceArea[1] || '';
      return pCity === city && pState === stateAbbr;
    })
    .sort((a, b) => {
      if (a.slug === 'dtla-print-los-angeles-ca') return -1;
      if (b.slug === 'dtla-print-los-angeles-ca') return 1;
      return b.rating - a.rating;
    });
}

export function getCityBySlug(slug: string): { city: string; stateAbbr: string; stateName: string; slug: string } | undefined {
  for (const state of getAllStates()) {
    for (const city of state.cities) {
      if (city.slug === slug) {
        return { city: city.name, stateAbbr: state.abbr, stateName: state.name, slug: city.slug };
      }
    }
  }
  return undefined;
}

export function getAllStateSlugs(): string[] {
  return getAllStates().map(s => s.slug);
}

export function getAllCitySlugs(): string[] {
  const slugs: string[] = [];
  for (const state of getAllStates()) {
    for (const city of state.cities) {
      slugs.push(city.slug);
    }
  }
  return slugs;
}
