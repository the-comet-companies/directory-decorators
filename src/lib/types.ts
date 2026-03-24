export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortSummary: string;
  address: string;
  neighborhood: string;
  city: string;
  serviceArea: string[];
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  website: string;
  servicesOffered: string[];
  productCategories: string[];
  printingMethods: string[];
  moq: number;
  turnaroundDays: number;
  rushAvailable: boolean;
  startingPrice: number | null;
  pricingTiers: PricingTier[];
  pickup: boolean;
  delivery: boolean;
  sustainabilityTags: string[];
  galleryImages: string[];
  coverImage: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  faqs: FAQ[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  customizationMethods: string[];
  ecoFriendly: boolean;
  finishingOptions: string[];
  // Feature flags from enrichment
  logoImage?: string;
  sameDayPrinting?: boolean;
  bulkOrders?: boolean;
  smallBatch?: boolean;
  customDesign?: boolean;
  onlineOrdering?: boolean;
  freeQuotes?: boolean;
  nationwideShipping?: boolean;
  contractPrinting?: boolean;
  dropshipping?: boolean;
}

export interface PricingTier {
  name: string;
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  serviceUsed: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  city: string;
  region: string;
}

export interface FilterState {
  search: string;
  serviceType: string[];
  screenPrintingType: string[];
  productType: string[];
  moq: string;
  turnaround: string;
  rushAvailable: boolean | null;
  priceRange: string;
  ecoFriendly: boolean | null;
  fulfillment: string[];
  rating: string;
  sort: string;
  page: number;
  // New feature filters
  bulkOrders: boolean | null;
  smallBatch: boolean | null;
  customDesign: boolean | null;
  onlineOrdering: boolean | null;
  nationwideShipping: boolean | null;
}

export type SortOption = 
  | 'recommended'
  | 'fastest'
  | 'lowest-moq'
  | 'highest-rated'
  | 'nearest'
  | 'newest';
