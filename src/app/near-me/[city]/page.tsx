export const revalidate = 86400;

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import ProviderCard from '@/components/ProviderCard';
import { getProvidersForCity } from '@/lib/geo';
import { getClaimedSlugs } from '@/lib/db';
import { NEAR_ME_CITIES } from '@/lib/near-me-cities';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return Object.keys(NEAR_ME_CITIES).map(city => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const data = NEAR_ME_CITIES[citySlug];
  if (!data) return {};

  const PAGE_URL = `https://directory.shoptitan.app/near-me/${citySlug}`;
  return {
    title: `Printing Companies Near Me in ${data.city} - Top 10 Screen Printers 2026`,
    description: `Find the best printing companies near you in ${data.city}, ${data.state}. Compare local screen printers, DTG, embroidery, and DTF shops. Get quotes from verified providers - updated 2026.`,
    keywords: `printing near me ${data.city}, screen printing ${data.city}, ${data.shortName} printers, DTG printing ${data.shortName}, embroidery ${data.city}, custom t-shirts ${data.shortName}`,
    openGraph: {
      title: `Printing Companies Near Me in ${data.city}`,
      description: `Top-rated printing companies in ${data.city} - screen printing, DTG, embroidery, and more.`,
      type: 'website',
      url: PAGE_URL,
    },
    alternates: { canonical: PAGE_URL },
  };
}

const SERVICES = [
  { name: 'Screen Printing', slug: 'screen-printing' },
  { name: 'DTG Printing', slug: 'dtg-printing' },
  { name: 'DTF Printing', slug: 'dtf-printing' },
  { name: 'Embroidery', slug: 'embroidery' },
  { name: 'Heat Transfer', slug: 'heat-transfer' },
  { name: 'Sublimation', slug: 'sublimation' },
];

function buildFaqs(city: string, shortName: string) {
  return [
    {
      q: `How much does custom screen printing cost in ${city}?`,
      a: `Prices vary by quantity and colors. In ${city}, expect $4 to $8 per shirt for runs of 48 to 100 pieces (1-color), dropping to $3 to $5 per shirt for 500+ pieces. Multi-color prints run 20 to 40 percent higher. Most ${shortName} shops offer free quotes.`,
    },
    {
      q: `What is the minimum order quantity (MOQ) for screen printing in ${shortName}?`,
      a: `Most ${shortName} screen printers have MOQs of 24 to 48 pieces. For smaller orders, look for shops offering DTG (Direct-to-Garment) printing. Many accept orders as low as 1 piece. Our directory lets you filter by MOQ.`,
    },
    {
      q: 'Which printing method is best for my order?',
      a: 'Screen printing is best for bulk orders of 48+ shirts with simple designs (vibrant, durable, cost-effective). DTG is ideal for small runs or photo-quality prints. Embroidery is the choice for caps, polos, and uniforms. DTF transfers work well on any fabric for small to medium runs.',
    },
    {
      q: `How fast can I get my order printed in ${city}?`,
      a: `Standard turnaround in ${shortName} is 5 to 10 business days. Many shops offer rush service (1 to 3 days) for an additional 25 to 50 percent fee. Several shops offer same-day and 24-hour rush printing for urgent orders.`,
    },
    {
      q: `Are there eco-friendly printing shops in ${city}?`,
      a: `Yes. Many ${shortName} shops now offer eco-friendly options including water-based inks, organic cotton blanks, and recycled packaging. Filter our directory by "eco-friendly" to find sustainable printers.`,
    },
    {
      q: `Can I get a free quote from ${shortName} printers?`,
      a: `Most shops offer free, no-obligation quotes. Use our Multi Quote tool to request quotes from up to 3 ${shortName} printers at once. They typically respond within 24 to 48 hours.`,
    },
    {
      q: `Do ${shortName} printers offer pickup and delivery?`,
      a: `Many ${shortName} shops offer local pickup (often same-day for rush orders) and citywide delivery. Filter by "Pickup" or "Delivery" in our directory to find shops with these options.`,
    },
  ];
}

export default async function NearMeCityPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const data = NEAR_ME_CITIES[citySlug];
  if (!data) notFound();

  const { city, state, stateFull, shortName, intro, locationsHeading, locationsBody, pricingBody, turnaroundBody } = data;
  const PAGE_URL = `https://directory.shoptitan.app/near-me/${citySlug}`;
  const FAQS = buildFaqs(city, shortName);

  const [providers, claimedSlugs] = await Promise.all([
    getProvidersForCity(city, state),
    getClaimedSlugs(),
  ]);

  const topProviders = providers.slice(0, 10);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Best Printing Companies in ${city}, ${state}`,
            itemListElement: topProviders.slice(0, 10).map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: `https://directory.shoptitan.app/provider/${p.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.shoptitan.app' },
              { '@type': 'ListItem', position: 2, name: 'Near Me', item: 'https://directory.shoptitan.app/near-me' },
              { '@type': 'ListItem', position: 3, name: `${city}, ${state}`, item: PAGE_URL },
            ],
          }),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-surface-500 mb-4">
          <Link href="/" className="hover:text-surface-800">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/near-me" className="hover:text-surface-800">Near Me</Link>
          <span className="mx-2">/</span>
          <span className="text-surface-800">{city}, {state}</span>
        </nav>

        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 leading-tight">
            Printing Companies Near Me in {city}, {state}
          </h1>
          <p className="mt-3 text-base text-surface-600 leading-relaxed">
            Compare the <strong>top {topProviders.length} printing companies in {city}</strong> - rated by real customers.
            Find local screen printers, DTG shops, embroidery specialists, and DTF providers. Get free quotes from verified
            printers, updated for 2026.
          </p>
        </header>

        {/* Intro */}
        <section className="max-w-none text-surface-700 mb-12 space-y-6 leading-relaxed">
          <p>{intro}</p>

          <h2 className="text-2xl font-bold text-surface-900 pt-4">{locationsHeading}</h2>
          <p dangerouslySetInnerHTML={{ __html: `${locationsBody} See our full <a href="/state/${stateFull.toLowerCase().replace(/\s+/g, '-')}" class="text-brand-600 hover:underline">${stateFull} directory</a> for other cities.` }} />

          <h2 className="text-2xl font-bold text-surface-900 pt-4">Pricing in {city}</h2>
          <p>
            For <Link href="/service/screen-printing" className="text-brand-600 hover:underline"><strong>screen printing</strong></Link>, <Link href="/service/dtg-printing" className="text-brand-600 hover:underline"><strong>DTG printing</strong></Link>, and <Link href="/service/embroidery" className="text-brand-600 hover:underline"><strong>embroidery</strong></Link> in {city}: {pricingBody} Use our <Link href="/cost-estimator" className="text-brand-600 hover:underline">Cost Estimator</Link> for a quick ballpark on your specific order.
          </p>

          <h2 className="text-2xl font-bold text-surface-900 pt-4">Services Offered by {shortName} Shops</h2>
          <p>
            Most shops offer multiple services. <Link href={`/best/screen-printing-in-${citySlug}-${state.toLowerCase()}`} className="text-brand-600 hover:underline"><strong>Screen printing</strong></Link> is best for bulk orders of 48+ shirts with simple designs. <Link href="/service/dtg-printing" className="text-brand-600 hover:underline"><strong>DTG</strong></Link> is ideal for small runs or photo-quality prints (see our <Link href="/guides/screen-printing-vs-dtg" className="text-brand-600 hover:underline">screen printing vs DTG guide</Link>). <Link href={`/best/embroidery-in-${citySlug}-${state.toLowerCase()}`} className="text-brand-600 hover:underline"><strong>Embroidery</strong></Link> is the choice for caps, polos, and uniforms. <Link href="/service/dtf-printing" className="text-brand-600 hover:underline"><strong>DTF transfers</strong></Link> work well on any fabric for small to medium runs (compare <Link href="/guides/dtf-vs-dtg-printing" className="text-brand-600 hover:underline">DTF vs DTG</Link>). <Link href="/service/sublimation" className="text-brand-600 hover:underline"><strong>Sublimation</strong></Link> is used for all-over prints on polyester.
          </p>

          <h2 className="text-2xl font-bold text-surface-900 pt-4">Turnaround Times</h2>
          <p>
            {turnaroundBody} Learn more in our <Link href="/guides/how-to-order-custom-t-shirts" className="text-brand-600 hover:underline">guide to ordering custom t-shirts</Link>.
          </p>

          <h2 className="text-2xl font-bold text-surface-900 pt-4">How to Get Free Quotes</h2>
          <p>
            Most shops offer free, no-obligation quotes. Use our <Link href="/request-quotes" className="text-brand-600 hover:underline">Multi Quote tool</Link> to request quotes from up to 3 {shortName} printers at once. They typically respond within 24 to 48 hours. Filter by MOQ, turnaround, eco-friendly, pickup, or delivery to narrow down shops that match your exact needs. For pricing estimates, check our <Link href="/guides/how-much-does-screen-printing-cost" className="text-brand-600 hover:underline">screen printing cost guide</Link> or <Link href="/guides/how-much-does-embroidery-cost" className="text-brand-600 hover:underline">embroidery cost guide</Link>.
          </p>
        </section>

        {/* Top Providers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">
            Top {topProviders.length} Printing Companies in {city}
          </h2>
          {topProviders.length === 0 ? (
            <p className="text-surface-500">Loading providers...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topProviders.map((p, i) => (
                <ProviderCard
                  key={p.slug}
                  provider={p}
                  index={i}
                  priority={i < 3}
                  verified={claimedSlugs.has(p.slug)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-surface-900 mb-4">
            Printing Services Available in {city}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SERVICES.map(s => (
              <Link
                key={s.slug}
                href={`/service/${s.slug}`}
                className="rounded-xl border border-surface-200 bg-white p-4 hover:border-surface-300 hover:shadow-sm transition-all"
              >
                <p className="font-semibold text-sm text-surface-900">{s.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">in {city}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-xl border border-surface-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-sm text-surface-900 list-none flex items-center justify-between">
                  {f.q}
                  <svg className="w-4 h-4 text-surface-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-surface-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Map CTA */}
        <section className="rounded-2xl border border-surface-200 bg-white p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-xl font-bold text-surface-900 mb-1">
                View All Printers on the Map
              </h2>
              <p className="text-sm text-surface-600">
                See every printing shop in {city} on an interactive map. Filter by service, city, and rating.
              </p>
            </div>
            <Link
              href="/near-me"
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/>
              </svg>
              Open Map View
            </Link>
          </div>
        </section>

        {/* Quote CTA */}
        <section className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center">
          <h2 className="text-xl font-bold text-surface-900 mb-2">
            Get Quotes from Top Printers in {city}
          </h2>
          <p className="text-sm text-surface-600 mb-5">
            Request quotes from up to 3 providers at once. Takes 2 minutes.
          </p>
          <Link
            href="/request-quotes"
            className="inline-flex items-center rounded-full bg-black text-white px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Get Free Quotes
          </Link>
        </section>
      </div>
      <Footer />
    </>
  );
}
