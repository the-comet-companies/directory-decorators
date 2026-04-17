import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How Much Does Screen Printing Cost in 2026? — Pricing Breakdown',
  description: 'Screen printing costs $5–$15 per shirt for orders of 72+. Full pricing table by quantity, number of colors, and garment type. Real 2026 US rates with tips to save.',
  openGraph: {
    title: 'How Much Does Screen Printing Cost in 2026? — Pricing Breakdown',
    description: 'Screen printing cost breakdown by colors, quantity, and garment type. Updated 2026 US market rates.',
    type: 'article',
  },
  alternates: { canonical: 'https://directory.shoptitan.app/guides/how-much-does-screen-printing-cost' },
};

const pricingData = [
  { qty: '12 pieces', oneColor: '$12–$18', twoThree: '$14–$22', fourPlus: '$18–$28' },
  { qty: '24 pieces', oneColor: '$9–$14', twoThree: '$11–$17', fourPlus: '$14–$22' },
  { qty: '48 pieces', oneColor: '$7–$11', twoThree: '$9–$14', fourPlus: '$12–$18' },
  { qty: '72 pieces', oneColor: '$5.50–$9', twoThree: '$7–$12', fourPlus: '$10–$15' },
  { qty: '144 pieces', oneColor: '$4–$7', twoThree: '$5.50–$9', fourPlus: '$8–$12' },
  { qty: '500 pieces', oneColor: '$2.50–$5', twoThree: '$3.50–$6.50', fourPlus: '$5–$9' },
  { qty: '1000+ pieces', oneColor: '$1.50–$3.50', twoThree: '$2.50–$5', fourPlus: '$4–$7' },
];

const garmentUpcharges = [
  { garment: 'T-Shirts (Gildan, Next Level)', upcharge: 'Base price ($3–$6 blank)' },
  { garment: 'Premium Tees (Bella+Canvas, Comfort Colors)', upcharge: '+$2–$5 per piece' },
  { garment: 'Hoodies & Sweatshirts', upcharge: '+$8–$15 per piece' },
  { garment: 'Tank Tops', upcharge: '+$1–$3 per piece' },
  { garment: 'Long Sleeve Tees', upcharge: '+$2–$4 per piece' },
  { garment: 'Tote Bags', upcharge: '+$1–$3 per piece' },
  { garment: 'Polos', upcharge: '+$5–$10 per piece' },
];

const pricingFactors = [
  {
    title: 'Number of Ink Colors',
    description: 'Each color in your design requires a separate screen. A 1-color print needs one screen, a 4-color print needs four. Each screen adds $20–$35 in setup cost, which is amortized across your order. For orders under 48, every extra color significantly increases the per-piece cost.',
  },
  {
    title: 'Order Quantity',
    description: 'Screen printing has a high upfront setup cost (screens, ink mixing, registration) but a low per-piece run cost. This means the more you order, the cheaper each piece gets. The biggest price drop happens between 24 and 72 pieces — that is the sweet spot where screen printing becomes very cost-effective.',
  },
  {
    title: 'Number of Print Locations',
    description: 'Printing on the front only is the cheapest option. Adding a back print, sleeve print, or inside-neck label each adds $1–$4 per piece plus an additional screen setup per color at that location. A front-and-back 2-color design requires 4 screens total.',
  },
  {
    title: 'Ink Type',
    description: 'Standard plastisol ink is the most affordable and durable option. Waterbased inks give a softer hand-feel but cost 10–20% more. Specialty inks like discharge, metallic, glow-in-the-dark, or puff add $1–$5 per piece depending on the effect.',
  },
  {
    title: 'Garment Brand and Type',
    description: 'The blank garment is a separate cost on top of printing. A basic Gildan 5000 tee costs $3–$4 wholesale, while a Bella+Canvas 3001 or Comfort Colors 1717 costs $5–$9. Hoodies run $12–$25 for the blank alone. The garment choice can double your total per-piece cost.',
  },
  {
    title: 'Artwork Complexity',
    description: 'Simple logos with solid colors are straightforward to print. Designs with halftones, gradients (simulated process), or photographic detail require more skilled separation work and may add $25–$75 in art preparation fees. Keep designs clean and bold for the best value.',
  },
];

const savingTips = [
  {
    title: 'Limit Your Colors to 1–2',
    description: 'Every additional ink color adds a screen setup fee ($20–$35) to your order. A bold 1-color or 2-color design can look just as professional as a 6-color print — and it costs significantly less, especially for orders under 100 pieces.',
  },
  {
    title: 'Hit the 72-Piece Threshold',
    description: 'Per-piece pricing drops sharply at 72 units. If you are ordering 50 shirts, consider bumping to 72 — the extra 22 shirts may cost less than you think because the setup cost is spread across more pieces.',
  },
  {
    title: 'Use Standard Ink on Standard Blanks',
    description: 'Plastisol ink on a Gildan 5000 or equivalent is the most cost-effective combination. Upgrading to premium blanks or specialty inks can add $5–$10 per piece. Unless your audience demands premium quality, standard options deliver great results.',
  },
  {
    title: 'Print on One Side Only',
    description: 'A front-only print avoids the extra screen setup and run cost of a second location. If you need a back design, consider a simple 1-color print on the back to keep the additional cost minimal.',
  },
  {
    title: 'Provide Print-Ready Artwork',
    description: 'Submitting your design as a vector file (AI, EPS, or SVG) with separated colors eliminates art preparation fees of $25–$75. If you only have a JPEG or PNG, ask if the shop charges for art cleanup before placing your order.',
  },
  {
    title: 'Order Everything at Once',
    description: 'Splitting a 200-piece order into two orders of 100 means paying setup fees twice. Combine sizes, colors, and styles into one order to maximize your volume discount and minimize setup charges.',
  },
];

const faqs = [
  {
    q: 'How much does it cost to screen print 100 t-shirts?',
    a: 'For 100 t-shirts with a 1-color front print on standard Gildan blanks, expect to pay $6–$10 per shirt all-in (blank + printing), or $600–$1,000 total. A 2-color design runs $7–$12 per shirt. Adding a back print adds $1.50–$3 per piece. These prices include setup fees amortized across the order.',
  },
  {
    q: 'Is there a setup fee for screen printing?',
    a: 'Yes. Screen printing requires creating a physical screen for each ink color. Setup fees typically run $20–$35 per screen (per color). A 3-color front design costs $60–$105 in setup. Most shops include the setup fee in their per-piece quote, but always ask to be sure. Some shops waive setup for large orders (200+ pieces).',
  },
  {
    q: 'What is the minimum order for screen printing?',
    a: 'Most screen printing shops require a minimum of 12–24 pieces because the setup process (burning screens, mixing inks, registering the press) takes the same amount of time regardless of quantity. Some shops offer lower minimums of 6 pieces but at a higher per-unit cost. For orders under 12, DTG (direct-to-garment) printing is usually more cost-effective.',
  },
  {
    q: 'Is screen printing cheaper than DTG?',
    a: 'For orders over 24 pieces, screen printing is almost always cheaper than DTG. A 1-color screen print on 50 shirts might cost $5–$8 per piece, while DTG on the same quantity costs $12–$18 per piece. However, for 1–12 pieces with full-color designs, DTG is cheaper because there are no screen setup fees.',
  },
  {
    q: 'How long does screen printing take?',
    a: 'Standard turnaround is 7–14 business days from art approval. Rush orders (3–5 days) are available at most shops for a 25–50% upcharge. Same-day printing is rare but possible for simple 1-color jobs at shops with open press time. Always confirm your deadline before placing an order.',
  },
  {
    q: 'Does screen printing last?',
    a: 'Screen printing is one of the most durable decoration methods available. A properly cured plastisol print will last 50+ washes without cracking, peeling, or fading. Waterbased prints may fade slightly faster but develop a soft, vintage look over time. To maximize longevity, wash garments inside-out in cold water and avoid high-heat drying.',
  },
];

export default function ScreenPrintingCostGuide() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/guides" className="hover:text-brand-600 transition-colors">Guides</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">Screen Printing Cost Guide</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-4 py-1.5 text-sm font-medium text-surface-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Pricing Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            How Much Does Screen Printing Cost in 2026?
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            Screen printing is the most popular method for custom t-shirts, hoodies, and event merch. This guide covers real pricing by quantity, color count, and garment type so you can budget your next order accurately.
          </p>
          <p className="text-xs text-surface-400 mt-3">Last updated: April 2026 &middot; Based on US market pricing</p>
        </header>

        {/* Quick Answer */}
        <section className="mb-14">
          <div className="rounded-xl bg-surface-100 border border-surface-200 px-6 py-5">
            <h2 className="text-lg font-bold text-surface-900 mb-2">Quick Answer</h2>
            <p className="text-sm text-surface-700 leading-relaxed">
              Screen printing costs <strong>$5–$15 per shirt</strong> for most orders (24–100 pieces). The main cost drivers are <strong>number of ink colors</strong>, <strong>order quantity</strong>, and <strong>garment type</strong>. Setup fees of $20–$35 per color apply. For 1,000+ pieces, prices can drop to $2–$5 per shirt.
            </p>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Screen Printing Cost Per Shirt by Quantity</h2>
          <p className="text-sm text-surface-500 mb-4">Prices below are for printing only (one location, front). Blank garment cost is additional.</p>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Quantity</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">1 Color</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">2–3 Colors</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">4+ Colors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {pricingData.map((row, i) => (
                  <tr key={i} className={i === 3 ? 'bg-surface-50' : ''}>
                    <td className="px-4 py-2.5 text-surface-600 font-medium">{row.qty}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.oneColor}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.twoThree}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.fourPlus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-surface-400 mt-2">* Print-only pricing (one location). Blank garment, art setup, and shipping are additional. Prices are 2026 US market estimates.</p>
        </section>

        {/* Garment Upcharges */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Blank Garment Costs</h2>
          <p className="text-sm text-surface-500 mb-4">The blank garment is a separate cost added to the per-piece print price. Here are typical wholesale costs:</p>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Garment</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {garmentUpcharges.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-surface-600 font-medium">{row.garment}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.upcharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What Affects Pricing */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-6">6 Factors That Affect Screen Printing Pricing</h2>
          <div className="space-y-5">
            {pricingFactors.map((factor, i) => (
              <div key={i} className="rounded-xl border border-surface-200 bg-white px-5 py-4">
                <h3 className="text-sm font-semibold text-surface-900 mb-1.5">{i + 1}. {factor.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Save Money */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-6">How to Save Money on Screen Printing</h2>
          <ol className="space-y-4">
            {savingTips.map((tip, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-surface-600 leading-relaxed">{tip.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-surface-200 bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-surface-800 hover:bg-surface-50 transition-colors">
                  {faq.q}
                  <svg className="w-4 h-4 text-surface-400 transition-transform group-open:rotate-180 shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-surface-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10 rounded-2xl bg-black px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Get screen printing quotes</h2>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">Compare verified screen printing shops near you or get an instant price estimate.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/service/screen-printing" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 transition-colors">
              Find Screen Printers
            </a>
            <a href="/cost-estimator" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Cost Estimator
            </a>
          </div>
        </section>
      </div>

      <Footer />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How Much Does Screen Printing Cost in 2026?',
            description: 'Screen printing costs $5–$15 per shirt for orders of 72+. Full pricing table by quantity, number of colors, and garment type.',
            datePublished: '2026-04-01',
            dateModified: '2026-04-07',
            author: { '@type': 'Organization', name: 'USA Decorator Directory', url: 'https://directory.shoptitan.app' },
            publisher: { '@type': 'Organization', name: 'USA Decorator Directory', url: 'https://directory.shoptitan.app' },
          }),
        }}
      />
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.shoptitan.app' },
              { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://directory.shoptitan.app/guides' },
              { '@type': 'ListItem', position: 3, name: 'Screen Printing Cost Guide', item: 'https://directory.shoptitan.app/guides/how-much-does-screen-printing-cost' },
            ],
          }),
        }}
      />
    </>
  );
}
