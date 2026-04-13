import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ProviderCard from '@/components/ProviderCard';
import { getClaimedSlugs } from '@/lib/db';
import { providers as seedProviders } from '@/lib/seed-data';
import { Provider } from '@/lib/types';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Service config                                                     */
/* ------------------------------------------------------------------ */

interface ServiceInfo {
  slug: string;
  name: string;
  filterValue: string;
  intro: string;
  benefits: string[];
}

const SERVICE_MAP: Record<string, ServiceInfo> = {
  'screen-printing': {
    slug: 'screen-printing',
    name: 'Screen Printing',
    filterValue: 'Screen Printing',
    intro:
      'Screen printing is one of the most popular and cost-effective methods for producing custom apparel and promotional products in bulk. Using mesh screens and ink, each color is applied one layer at a time, producing vibrant, durable prints that last through hundreds of washes. Ideal for t-shirts, hoodies, tote bags, and more.',
    benefits: ['Best for large orders', 'Vibrant long-lasting colors', 'Low per-unit cost at scale', 'Works on cotton, polyester & blends'],
  },
  'dtg-printing': {
    slug: 'dtg-printing',
    name: 'DTG Printing',
    filterValue: 'DTG Printing',
    intro:
      'Direct-to-garment (DTG) printing uses specialized inkjet technology to print full-color designs directly onto fabric. Perfect for detailed artwork, photo-realistic images, and small-batch orders with no minimum quantities. DTG delivers soft-hand prints with unlimited color possibilities.',
    benefits: ['No minimum order quantity', 'Full-color photo-quality prints', 'Soft hand feel', 'Fast turnaround for small runs'],
  },
  'dtf-printing': {
    slug: 'dtf-printing',
    name: 'DTF Printing',
    filterValue: 'DTF Printing',
    intro:
      'Direct-to-film (DTF) printing transfers full-color designs onto a special film that is then heat-pressed onto garments. This versatile method works on virtually any fabric type and color, making it a go-to choice for multi-material orders and complex designs.',
    benefits: ['Works on any fabric color', 'No weeding required', 'Vibrant full-color output', 'Great for mixed-material orders'],
  },
  embroidery: {
    slug: 'embroidery',
    name: 'Embroidery',
    filterValue: 'Embroidery',
    intro:
      'Embroidery adds a premium, professional touch to apparel and accessories by stitching designs directly into the fabric. Perfect for corporate uniforms, team gear, caps, and polo shirts, embroidery offers unmatched durability and a classic, high-end look.',
    benefits: ['Premium professional appearance', 'Extremely durable', 'Great for logos & text', 'Ideal for caps, polos & jackets'],
  },
  sublimation: {
    slug: 'sublimation',
    name: 'Sublimation',
    filterValue: 'Sublimation',
    intro:
      'Dye sublimation uses heat to infuse ink directly into polyester fabrics and coated substrates, producing vivid, all-over prints that never crack, peel, or fade. Ideal for athletic wear, all-over print apparel, mugs, and promotional products.',
    benefits: ['All-over edge-to-edge printing', 'Never cracks or peels', 'Vibrant photo-quality colors', 'Perfect for sportswear'],
  },
  'heat-transfer': {
    slug: 'heat-transfer',
    name: 'Heat Transfer',
    filterValue: 'Heat Transfer',
    intro:
      'Heat transfer printing applies pre-printed designs to garments using heat and pressure. This method supports a wide range of materials and offers sharp, detailed results. It is popular for names, numbers, logos, and multi-color artwork on various apparel types.',
    benefits: ['Versatile material compatibility', 'Sharp detail reproduction', 'Great for names & numbers', 'Works on dark and light fabrics'],
  },
  'vinyl-printing': {
    slug: 'vinyl-printing',
    name: 'Vinyl Printing',
    filterValue: 'Vinyl Printing',
    intro:
      'Vinyl printing (also known as heat-transfer vinyl or HTV) involves cutting colored vinyl sheets into designs and heat-pressing them onto garments. It produces bold, eye-catching graphics with a smooth or textured finish, perfect for names, numbers, and simple multi-color designs.',
    benefits: ['Bold opaque colors', 'Specialty finishes available (glitter, metallic)', 'Durable and washable', 'Ideal for small personalized orders'],
  },
  'large-format-printing': {
    slug: 'large-format-printing',
    name: 'Large Format Printing',
    filterValue: 'Large Format Printing',
    intro:
      'Large format printing produces oversized graphics including banners, posters, vehicle wraps, trade show displays, and wall murals. Using wide-format inkjet printers, this method delivers high-resolution output on vinyl, fabric, paper, and rigid substrates.',
    benefits: ['Banners, signs & displays', 'High-resolution output', 'Indoor and outdoor options', 'Wide material selection'],
  },
  'custom-apparel': {
    slug: 'custom-apparel',
    name: 'Custom Apparel',
    filterValue: 'Custom Apparel',
    intro:
      'Custom apparel services cover the full spectrum of personalized clothing — from branded corporate uniforms and team jerseys to event merchandise and fashion lines. Providers offer end-to-end solutions including design assistance, sampling, production, and fulfillment.',
    benefits: ['End-to-end design & production', 'Wide garment selection', 'Branding & labeling options', 'Bulk and small-batch available'],
  },
};

const ALL_SERVICES = Object.values(SERVICE_MAP);

const DTLA_SLUG = 'dtla-print-los-angeles-ca';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getProvidersForService(filterValue: string): Provider[] {
  const results = seedProviders.filter((p) =>
    (p.servicesOffered || []).some((s) => s?.toLowerCase() === filterValue.toLowerCase()),
  );

  // Sort by rating * log(reviews) for best results first
  results.sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log((a.reviewCount || 0) + 1);
    const scoreB = (b.rating || 0) * Math.log((b.reviewCount || 0) + 1);
    return scoreB - scoreA;
  });

  // Pin DTLA Print first
  const dtlaIndex = results.findIndex((p) => p.slug === DTLA_SLUG);
  if (dtlaIndex > 0) {
    const [dtla] = results.splice(dtlaIndex, 1);
    results.unshift(dtla);
  } else if (dtlaIndex === -1) {
    const dtla = seedProviders.find((p) => p.slug === DTLA_SLUG);
    if (dtla) results.unshift(dtla);
  }

  return results.slice(0, 60);
}

function getRelatedServices(currentSlug: string): ServiceInfo[] {
  return ALL_SERVICES.filter((s) => s.slug !== currentSlug).slice(0, 6);
}

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return [
    { slug: 'screen-printing' },
    { slug: 'dtg-printing' },
    { slug: 'dtf-printing' },
    { slug: 'embroidery' },
    { slug: 'sublimation' },
    { slug: 'heat-transfer' },
    { slug: 'vinyl-printing' },
    { slug: 'large-format-printing' },
    { slug: 'custom-apparel' },
  ];
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_MAP[slug];
  if (!service) return {};

  const providers = getProvidersForService(service.filterValue);
  const count = providers.length;

  const title = `Best ${service.name} Services — Compare ${count}+ Top-Rated Companies 2026`;
  const description = `Compare ${count}+ top-rated ${service.name.toLowerCase()} companies across the USA. ${service.benefits.slice(0, 2).join(', ')}. Find the best ${service.name.toLowerCase()} provider near you. Updated 2026.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://directory.shoptitan.app/service/${slug}`,
    },
    alternates: {
      canonical: `https://directory.shoptitan.app/service/${slug}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICE_MAP[slug];
  if (!service) notFound();

  const providers = getProvidersForService(service.filterValue);
  const relatedServices = getRelatedServices(slug);
  const claimedSlugs = await getClaimedSlugs();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://directory.shoptitan.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://directory.shoptitan.app/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.name,
        item: `https://directory.shoptitan.app/service/${slug}`,
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${service.name} Services in the USA`,
    description: `Top ${service.name.toLowerCase()} companies across the United States`,
    numberOfItems: providers.length,
    itemListElement: providers.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: p.name,
        url: `https://directory.shoptitan.app/provider/${p.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: p.city,
        },
        ...(p.rating > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: p.rating,
                reviewCount: p.reviewCount,
              },
            }
          : {}),
      },
    })),
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">
            Home
          </a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/services" className="hover:text-brand-600 transition-colors">
            Services
          </a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">{service.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">
            {service.name} Services in the USA
          </h1>
          <p className="text-surface-500 mt-2 max-w-3xl">
            Browse{' '}
            <span className="font-semibold text-surface-700">{providers.length}</span>{' '}
            {service.name.toLowerCase()} {providers.length === 1 ? 'company' : 'companies'}{' '}
            offering high-quality printing services across the United States.
          </p>
        </div>

        {/* Intro paragraph */}
        <section className="mb-10 rounded-2xl border border-surface-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-3">
            What is {service.name}?
          </h2>
          <p className="text-sm text-surface-600 leading-relaxed mb-4">{service.intro}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {service.benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-surface-700">
                <svg
                  className="w-4 h-4 text-emerald-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* Provider grid */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Top {service.name} Companies ({providers.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providers.map((p, i) => (
              <ProviderCard key={p.id} provider={p} index={i} verified={claimedSlugs.has(p.slug)} />
            ))}
          </div>
        </section>

        {/* Find Near Me CTA */}
        <section className="mb-12 rounded-2xl bg-brand-600 text-white p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Find {service.name} Near You
          </h2>
          <p className="text-brand-100 max-w-2xl mx-auto mb-6">
            Browse {providers.length}+ verified {service.name.toLowerCase()}{' '}
            companies across the USA. Compare ratings, services, and turnaround times.
          </p>
          <a
            href="/near-me"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-brand-700 hover:bg-brand-50 transition-colors shadow-lg"
          >
            Find Near Me
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </section>

        {/* Related Services */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">
            Related Printing Services
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((rs) => (
              <Link
                key={rs.slug}
                href={`/service/${rs.slug}`}
                className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50 transition-colors group"
              >
                <div className="flex-1">
                  <span className="font-medium text-surface-800 group-hover:text-brand-700 transition-colors">
                    {rs.name}
                  </span>
                  <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">
                    {rs.benefits[0]}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-surface-400 group-hover:text-brand-500 transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />

      {/* JSON-LD: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* JSON-LD: ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </>
  );
}
