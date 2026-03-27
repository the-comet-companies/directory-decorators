import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Print Services Hub USA — The #1 Printing Directory',
  description: 'Print Services Hub USA is the most complete directory of 596+ custom printing companies across 27 states. Find screen printing, embroidery, DTG, and more.',
  openGraph: {
    title: 'About Print Services Hub USA — The #1 Printing Directory',
    description: 'The most complete directory of 596+ custom printing companies across 27 states.',
    type: 'website',
  },
  alternates: { canonical: 'https://directory.dtlaprint.com/about' },
};

const stats = [
  { value: '729+', label: 'Printing Companies' },
  { value: '50', label: 'States Covered' },
  { value: '6', label: 'Service Types' },
  { value: '100%', label: 'Free to Use' },
];

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Screen Printing',
    description: 'The gold standard for bulk apparel. Vivid, durable prints on t-shirts, hoodies, and more — with specialty techniques like puff, high density, foil, and waterbased.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Embroidery',
    description: 'Classic, premium texture for hats, polos, jackets, and branded uniforms. Embroidery adds a professional look that lasts as long as the garment.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'DTG Printing',
    description: 'Direct-to-garment printing with no minimums. Perfect for full-color artwork, photos, and small runs where every piece can be different.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Heat Transfer',
    description: 'Versatile transfers applied with heat and pressure. Great for names and numbers, one-offs, and specialty materials that can\'t go through other processes.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Sublimation',
    description: 'All-over, edge-to-edge printing on polyester and performance fabrics. Used for sportswear, jerseys, and fully custom cut-and-sew apparel.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Promotional Products',
    description: 'Branded hats, tote bags, drinkware, patches, and more. Everything a business needs to outfit a team, run an event, or grow brand awareness.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Search or Browse',
    description: 'Find printing companies by service type, product, turnaround time, minimum order, or location. Every listing in our directory has been verified.',
  },
  {
    step: '02',
    title: 'Compare Options',
    description: 'Read detailed profiles — services offered, printing methods, pricing tiers, reviews, and turnaround times — side by side before you decide.',
  },
  {
    step: '03',
    title: 'Get a Quote',
    description: 'Contact the printer directly from their profile page. No middlemen, no markups. Just you and the shop that best fits your project.',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <section className="py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            The USA Printing Directory
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-surface-900 mb-6 max-w-3xl mx-auto leading-tight">
            Finding the right printer{' '}
            <span className="text-brand-600">shouldn&apos;t be hard</span>
          </h1>
          <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto leading-relaxed">
            Print Services Hub USA is the most complete directory of custom printing companies in the United States.
            We list screen printers, embroiderers, DTG shops, and specialty print houses from coast to coast — so you can
            find the right fit for your project in minutes.
          </p>
        </section>

        {/* Stats */}
        <section className="py-10 border-y border-surface-100">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <dt className="text-3xl sm:text-4xl font-extrabold text-brand-600">{s.value}</dt>
                <dd className="mt-1 text-sm font-medium text-surface-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-5">
              Our mission is simple
            </h2>
            <div className="space-y-4 text-surface-600 leading-relaxed">
              <p>
                Every year, thousands of businesses, organizations, and individuals need custom printed apparel — for
                uniforms, events, merchandise, and promotions. But finding a reliable, quality printer is frustrating.
                Search results are cluttered, reviews are inconsistent, and quotes require endless back-and-forth.
              </p>
              <p>
                We built Print Services Hub USA to change that. Our directory gives you a single, structured place to
                discover and compare printing companies across all 50 states. Every listing shows you the services
                offered, minimum order quantities, turnaround times, and real customer reviews — so you can make a
                confident decision before you ever pick up the phone.
              </p>
              <p>
                Whether you need 12 shirts by Thursday or 10,000 hoodies by next quarter, there&apos;s a printer in
                our directory that can handle it.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Rush orders', sub: 'Same-day & next-day printers available' },
              { label: 'No minimums', sub: 'Shops that print as few as 1 piece' },
              { label: 'Eco-friendly', sub: 'Waterbased & sustainable options' },
              { label: 'Nationwide', sub: 'Every state, every service type' },
            ].map(card => (
              <div key={card.label} className="rounded-2xl bg-surface-50 border border-surface-100 p-5">
                <p className="font-semibold text-surface-900 text-sm">{card.label}</p>
                <p className="text-xs text-surface-500 mt-1 leading-relaxed">{card.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="py-16 sm:py-20 border-t border-surface-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-3">
              Every printing method, covered
            </h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              Our directory spans every major printing technique so you always find the right process for your project.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.title} className="rounded-2xl border border-surface-100 bg-white p-6 hover:border-brand-200 hover:shadow-sm transition-all duration-200">
                <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-brand-50 text-brand-600 mb-4">
                  {s.icon}
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{s.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 border-t border-surface-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              From search to quote in three steps — no account required.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {howItWorks.map(step => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-600 text-white font-bold text-lg mb-5">
                  {step.step}
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 border-t border-surface-100">
          <div className="rounded-3xl bg-brand-600 px-8 py-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-brand-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Browse our directory to find the perfect printer for your project.
            </p>
            <a
              href="/"
              className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors shadow-sm"
            >
              Browse the Directory
            </a>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
