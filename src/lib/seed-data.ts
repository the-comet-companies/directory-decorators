import { Provider } from './types';
import companiesData from './companies.json';

export const providers: Provider[] = companiesData as Provider[];

export const services = [
  { id: '1', name: 'Screen Printing', slug: 'screen-printing', description: 'High-quality screen printing for bulk orders.', icon: '🖨️' },
  { id: '2', name: 'Embroidery', slug: 'embroidery', description: 'Professional embroidery for apparel and accessories.', icon: '🧵' },
  { id: '3', name: 'DTG Printing', slug: 'dtg-printing', description: 'Direct-to-garment printing for full-color designs.', icon: '👕' },
  { id: '4', name: 'Heat Transfer', slug: 'heat-transfer', description: 'Heat transfer printing for detailed designs.', icon: '🔥' },
  { id: '5', name: 'Sublimation', slug: 'sublimation', description: 'Dye sublimation for vibrant all-over prints.', icon: '🌈' },
];

export const neighborhoods = [
  ...Array.from(new Set((companiesData as Provider[]).map(p => p.city).filter(Boolean)))
    .sort()
    .map((city, i) => ({ id: String(i + 1), name: city, slug: city.toLowerCase().replace(/\s+/g, '-'), city, region: '' })),
];

export const productCategories = [
  { id: '1', name: 'T-Shirts', slug: 't-shirts' },
  { id: '2', name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
  { id: '3', name: 'Caps & Hats', slug: 'caps-hats' },
  { id: '4', name: 'Polos', slug: 'polos' },
  { id: '5', name: 'Tote Bags', slug: 'tote-bags' },
  { id: '6', name: 'Promotional Items', slug: 'promotional-items' },
];
