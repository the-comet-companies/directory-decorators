import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Printing Services — Print Services Hub USA',
  description: 'Browse all custom printing services available across the USA: screen printing, DTG, embroidery, heat transfer, sublimation, and more.',
};

const services = [
  {
    name: 'Screen Printing',
    slug: 'Screen Printing',
    image: 'https://blog.uberprints.com/content/images/2020/08/screen-printing-process-01-2000w.jpg',
    tag: 'Most Popular',
    tagColor: 'bg-brand-600',
    description:
      'The gold standard for bulk orders. Vivid, durable ink is applied through a mesh screen onto the garment — ideal for t-shirts, hoodies, and anything needing consistent color across large runs.',
    bestFor: 'Bulk orders, events, uniforms, merch',
    details: [
      { label: 'Minimum order', value: '12+ pieces' },
      { label: 'Colors', value: 'Spot colors (unlimited with specialty inks)' },
      { label: 'Best on', value: 'Cotton & cotton blends' },
      { label: 'Specialty', value: 'Puff, foil, high density, waterbased' },
    ],
    bg: 'bg-brand-50',
    text: 'text-brand-600',
    border: 'border-brand-200',
  },
  {
    name: 'DTG Printing',
    slug: 'DTG Printing',
    image: 'https://ricohdtg.com/hs-fs/hubfs/20230828_212757367_iOS.webp?width=950&height=1267&name=20230828_212757367_iOS.webp',
    tag: 'No Minimums',
    tagColor: 'bg-emerald-600',
    description:
      'Direct-to-garment printing uses inkjet technology to print full-color artwork directly onto fabric. No screens, no setup — perfect for photos, gradients, and small runs where every piece can be different.',
    bestFor: 'Small runs, one-offs, photo prints, samples',
    details: [
      { label: 'Minimum order', value: 'As low as 1 piece' },
      { label: 'Colors', value: 'Full color, photos, gradients' },
      { label: 'Best on', value: '100% cotton' },
      { label: 'Turnaround', value: 'Often same or next day' },
    ],
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  {
    name: 'Embroidery',
    slug: 'Embroidery',
    image: 'https://melco.com/wp-content/uploads/2023/04/Hats-Header.jpg',
    tag: 'Premium Look',
    tagColor: 'bg-rose-600',
    description:
      'Thread stitched directly into the fabric by a machine. Embroidery adds a classic, raised, textured finish that looks and feels premium — great for logos, monograms, and branded uniforms that need to stand out.',
    bestFor: 'Hats, polos, jackets, corporate uniforms',
    details: [
      { label: 'Minimum order', value: '12–24 pieces typical' },
      { label: 'Colors', value: 'Thread colors matched to brand' },
      { label: 'Best on', value: 'Hats, polos, fleece, outerwear' },
      { label: 'Durability', value: 'Outlasts the garment' },
    ],
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
  },
  {
    name: 'Heat Transfer',
    slug: 'Heat Transfer',
    image: 'https://www.allprintheads.com/cdn/shop/articles/heat_press_35b30dad-8c92-48d7-8b7f-f0213b468a23.jpg?v=1758019009&width=1024',
    tag: 'Versatile',
    tagColor: 'bg-orange-600',
    description:
      "Designs are printed onto transfer paper and applied to garments using heat and pressure. Great for names and numbers, specialty materials, and one-offs that can't go through other processes.",
    bestFor: 'Sports jerseys, names & numbers, specialty fabrics',
    details: [
      { label: 'Minimum order', value: 'As low as 1 piece' },
      { label: 'Colors', value: 'Full color available' },
      { label: 'Best on', value: 'Most fabric types' },
      { label: 'Specialty', value: 'Glitter, foil, glow-in-dark transfers' },
    ],
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  {
    name: 'Sublimation',
    slug: 'Sublimation',
    image: 'https://nightfoxdesigns.com/wp-content/uploads/2024/05/Sublimation-Jerseys-Nightfox-Labs.jpg',
    tag: 'All-Over Print',
    tagColor: 'bg-cyan-600',
    description:
      'Dye sublimation bonds ink directly into polyester fibers, creating vivid, all-over prints from edge to edge. No cracking, no peeling — the ink becomes part of the fabric. Perfect for sportswear and custom cut-and-sew.',
    bestFor: 'Jerseys, sportswear, all-over custom apparel',
    details: [
      { label: 'Minimum order', value: 'Varies by shop' },
      { label: 'Colors', value: 'Infinite — full photographic quality' },
      { label: 'Best on', value: '100% polyester or performance fabrics' },
      { label: 'Coverage', value: 'Edge-to-edge, no borders' },
    ],
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
  },
  {
    name: 'Promotional Products',
    slug: 'Promotional Products',
    image: 'https://printify.com/wp-content/uploads/2025/01/Branded-merchandise-Printify-1024x683.png',
    tag: 'Brand Merch',
    tagColor: 'bg-violet-600',
    description:
      'Beyond apparel — branded hats, tote bags, drinkware, patches, stickers, lanyards, and more. Everything a business, team, or event organizer needs to build brand awareness and reward their audience.',
    bestFor: 'Events, giveaways, corporate gifts, brand kits',
    details: [
      { label: 'Products', value: 'Hats, bags, drinkware, patches & more' },
      { label: 'Minimum order', value: 'Low minimums available' },
      { label: 'Best for', value: 'Trade shows, events, team gifts' },
      { label: 'Branding', value: 'Logo placement on any product' },
    ],
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-200',
  },
  {
    name: 'Custom Apparel',
    slug: 'Custom Apparel',
    image: 'https://burst.shopifycdn.com/photos/t-shirts-hanging-on-rack.jpg',
    tag: 'End-to-End',
    tagColor: 'bg-amber-600',
    description:
      'Full-service custom apparel from concept to finished product. Work with shops that help you choose blanks, finalize artwork, select print methods, and deliver retail-ready garments for your brand or event.',
    bestFor: 'Brands, retailers, event organizers, influencers',
    details: [
      { label: 'Services', value: 'Design, sourcing, printing, fulfillment' },
      { label: 'Quantities', value: 'Retail & wholesale' },
      { label: 'Best for', value: 'Full brand launches, event collections' },
      { label: 'Support', value: 'Design assistance available' },
    ],
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Every Printing Method, Covered
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-900 mb-6 max-w-3xl mx-auto leading-tight">
            Not sure which service{' '}
            <span className="text-brand-600">is right for you?</span>
          </h1>
          <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto leading-relaxed">
            Each printing method has a sweet spot. Browse the guide below to find the best fit for your project — then connect with a verified shop that specializes in it.
          </p>
        </section>

        {/* Quick comparison pills */}
        <section className="pb-14">
          <div className="flex flex-wrap justify-center gap-3">
            {services.map(s => (
              <a
                key={s.name}
                href={`#${s.slug.toLowerCase().replace(/ /g, '-')}`}
                className={`rounded-full border ${s.border} ${s.bg} ${s.text} px-4 py-1.5 text-sm font-medium hover:shadow-sm transition-all`}
              >
                {s.name}
              </a>
            ))}
          </div>
        </section>

        {/* Service cards */}
        <section className="pb-20 space-y-16">
          {services.map((service, i) => (
            <div
              key={service.name}
              id={service.slug.toLowerCase().replace(/ /g, '-')}
              style={{ scrollMarginTop: '80px' }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0 rounded-3xl overflow-hidden border border-surface-100 shadow-sm`}
            >
              {/* Image */}
              <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-4 left-4 ${service.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {service.tag}
                </span>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 bg-white p-8 lg:p-10 flex flex-col justify-center">
                <h2 className={`text-2xl sm:text-3xl font-bold text-surface-900 mb-3`}>{service.name}</h2>
                <p className={`text-xs font-semibold uppercase tracking-wide ${service.text} mb-4`}>
                  Best for: {service.bestFor}
                </p>
                <p className="text-surface-600 leading-relaxed mb-6">{service.description}</p>

                <dl className="grid grid-cols-2 gap-3 mb-8">
                  {service.details.map(d => (
                    <div key={d.label} className={`rounded-xl ${service.bg} p-3`}>
                      <dt className={`text-xs font-semibold ${service.text} mb-0.5`}>{d.label}</dt>
                      <dd className="text-sm text-surface-700 font-medium">{d.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={`/?serviceType=${encodeURIComponent(service.slug)}`}
                  className={`self-start inline-flex items-center gap-2 rounded-full bg-surface-900 hover:bg-surface-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors`}
                >
                  Browse {service.name} shops
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="rounded-3xl bg-brand-600 px-8 py-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Still not sure? Browse everything.
            </h2>
            <p className="text-brand-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Use our filters to narrow down by quantity, turnaround time, budget, and location — then compare shops side by side.
            </p>
            <a
              href="/"
              className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors shadow-sm"
            >
              Browse All Companies
            </a>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
