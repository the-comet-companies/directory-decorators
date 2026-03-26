import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Screen Printing vs DTG Printing — Which Is Right for You? (2026 Guide)',
  description: 'Screen printing vs DTG printing compared side by side. Learn which method is cheaper, more durable, and better for your project. Includes cost breakdown, pros & cons, and FAQs.',
  openGraph: {
    title: 'Screen Printing vs DTG Printing — Which Is Right for You? (2026 Guide)',
    description: 'Side-by-side comparison of screen printing and DTG printing. Find out which method fits your budget, timeline, and design.',
    type: 'article',
  },
  alternates: { canonical: 'https://directory.dtlaprint.com/guides/screen-printing-vs-dtg' },
};

const comparisonRows = [
  { feature: 'Cost per unit', screen: '$4–$10 (at 50+ pieces)', dtg: '$10–$25 (any quantity)' },
  { feature: 'Minimum order', screen: '12–24 pieces typical', dtg: 'No minimum — even 1 shirt' },
  { feature: 'Colors', screen: 'Best with 1–6 spot colors', dtg: 'Unlimited colors, full CMYK' },
  { feature: 'Best for', screen: 'Bulk orders, simple logos, uniforms', dtg: 'Small batches, photos, complex art' },
  { feature: 'Durability', screen: 'Excellent — ink bonds into fabric', dtg: 'Very good — similar to screen on cotton' },
  { feature: 'Setup time', screen: 'Longer — screens must be prepared', dtg: 'Minimal — print directly from file' },
  { feature: 'Turnaround', screen: '5–10 business days', dtg: '1–5 business days' },
  { feature: 'Fabric types', screen: 'Works on almost any fabric', dtg: 'Best on 100% cotton or cotton-rich blends' },
  { feature: 'Feel on fabric', screen: 'Slightly raised, smooth finish', dtg: 'Soft hand feel, ink absorbs into fibers' },
  { feature: 'Eco-friendliness', screen: 'Uses more water and chemicals', dtg: 'Water-based inks, less waste overall' },
];

const faqs = [
  {
    q: 'Is screen printing cheaper than DTG?',
    a: 'Yes, for large orders. Screen printing becomes significantly cheaper per unit once you order 24 or more pieces because the setup cost is spread across more shirts. For orders under 12 pieces, DTG is almost always more affordable since there are no screen setup fees.',
  },
  {
    q: 'Which lasts longer, screen printing or DTG?',
    a: 'Both methods produce durable prints when done correctly. Screen printing has a slight edge in longevity because the ink sits on top of the fabric in a thicker layer. DTG prints hold up very well on 100% cotton when properly pretreated and cured. Both can last 50+ washes with proper care.',
  },
  {
    q: 'Can DTG print white on dark shirts?',
    a: 'Yes. Modern DTG printers lay down a white ink underbase before printing colors on dark garments. This allows full-color prints on black, navy, and other dark fabrics. The white underbase adds a slight hand feel but ensures vibrant colors.',
  },
  {
    q: 'What is the minimum order for screen printing vs DTG?',
    a: 'Screen printing typically requires a minimum of 12–24 pieces because each color needs a separate screen to be created. DTG has no minimum order — you can print a single shirt economically. Some screen printers accept smaller runs but charge higher per-unit prices to cover setup.',
  },
  {
    q: 'Which is better for photos and complex designs?',
    a: 'DTG printing is the clear winner for photographic and highly detailed designs. It prints in full CMYK color with no limit on gradients, shading, or color count. Screen printing requires color separations and is limited to spot colors, making it impractical for photo-realistic artwork.',
  },
];

export default function ScreenPrintingVsDtg() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/services" className="hover:text-brand-600 transition-colors">Services</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">Screen Printing vs DTG</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Comparison Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            Screen Printing vs DTG Printing — Which Is Right for You?
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            Screen printing and direct-to-garment (DTG) printing are the two most popular methods for custom apparel. Each has clear strengths depending on your order size, design complexity, budget, and timeline. This guide breaks down every difference so you can choose with confidence.
          </p>
        </header>

        {/* Quick Answer */}
        <section className="mb-14 rounded-xl border border-brand-200 bg-brand-50 px-6 py-5">
          <h2 className="text-lg font-bold text-brand-800 mb-2">Quick Answer</h2>
          <p className="text-sm text-brand-700 leading-relaxed">
            Choose <strong>screen printing</strong> if you need 24+ shirts with a simple 1–4 color design — it is cheaper per unit and extremely durable. Choose <strong>DTG printing</strong> if you need fewer than 24 shirts, full-color photographic artwork, or a fast turnaround with no minimums.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Feature</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Screen Printing</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">DTG Printing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 font-medium text-surface-800">{row.feature}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.screen}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.dtg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to Choose Screen Printing */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">When to Choose Screen Printing</h2>
          <ul className="space-y-3">
            {[
              'You are ordering 24 or more pieces and want the lowest per-unit cost.',
              'Your design uses 1–4 solid colors (logos, text, simple graphics).',
              'You need prints on a variety of fabric types, including polyester and nylon.',
              'Durability is critical — uniforms, workwear, and merchandise that must survive heavy washing.',
              'You want specialty inks such as metallic, glow-in-the-dark, or puff ink finishes.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-surface-600 leading-relaxed">
                <svg className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* When to Choose DTG Printing */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">When to Choose DTG Printing</h2>
          <ul className="space-y-3">
            {[
              'You need a small batch — even a single custom shirt — without paying setup fees.',
              'Your design is full-color, photographic, or has complex gradients and shading.',
              'You want a soft hand feel where the ink absorbs into the fabric instead of sitting on top.',
              'Speed matters — DTG requires almost no setup time and can print same-day.',
              'You are testing designs or running a print-on-demand business with many variations.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-surface-600 leading-relaxed">
                <svg className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Can You Combine Both? */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Can You Combine Both?</h2>
          <p className="text-sm text-surface-600 leading-relaxed">
            Absolutely. Many print shops offer both screen printing and DTG under one roof. A common strategy is to use screen printing for your core bulk order (e.g., 200 event shirts in one design) and DTG for limited-edition variants, individual name customization, or sample runs before committing to a full screen print production. Ask your printer about hybrid pricing — shops that handle both methods in-house often provide discounts when you bundle.
          </p>
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
        <section className="mb-10 rounded-2xl bg-brand-600 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to print?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">Compare screen printing and DTG shops near you, or request a free quote in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/service/screen-printing" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              Screen Printing Shops
            </a>
            <a href="/service/dtg-printing" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              DTG Printing Shops
            </a>
            <a href="/get-quote" className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Get Free Quotes
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
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.dtlaprint.com' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://directory.dtlaprint.com/services' },
              { '@type': 'ListItem', position: 3, name: 'Screen Printing vs DTG', item: 'https://directory.dtlaprint.com/guides/screen-printing-vs-dtg' },
            ],
          }),
        }}
      />
    </>
  );
}
