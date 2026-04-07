import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DTF vs DTG Printing — Which Is Better in 2026? Full Comparison',
  description: 'DTF vs DTG printing compared: cost, quality, durability, fabric compatibility, and minimums. Find out which print method is right for your project in 2026.',
  openGraph: {
    title: 'DTF vs DTG Printing — Which Is Better in 2026? Full Comparison',
    description: 'Head-to-head comparison of DTF and DTG printing: cost, quality, durability, and best use cases.',
    type: 'article',
  },
  alternates: { canonical: 'https://directory.dtlaprint.com/guides/dtf-vs-dtg-printing' },
};

const comparisonData = [
  { feature: 'Full Name', dtf: 'Direct-to-Film', dtg: 'Direct-to-Garment' },
  { feature: 'How It Works', dtf: 'Design printed onto PET film, coated with adhesive powder, heat-pressed onto fabric', dtg: 'Ink sprayed directly onto the garment using a specialized inkjet printer' },
  { feature: 'Cost (24 pieces)', dtf: '$6–$12 per piece', dtg: '$10–$18 per piece' },
  { feature: 'Cost (100 pieces)', dtf: '$4–$8 per piece', dtg: '$8–$14 per piece' },
  { feature: 'Minimum Order', dtf: 'No minimum (even 1 piece)', dtg: 'No minimum (even 1 piece)' },
  { feature: 'Print Feel', dtf: 'Slight raised texture, like a thin vinyl layer', dtg: 'Soft, breathes with the fabric, almost no hand-feel' },
  { feature: 'Color Quality', dtf: 'Vibrant on all fabric colors, whites are solid', dtg: 'Excellent on light fabrics, good on darks with white underbase' },
  { feature: 'Durability', dtf: '50+ washes, may crack under extreme stretch', dtg: '40–60 washes, fades gradually, no cracking' },
  { feature: 'Fabric Compatibility', dtf: 'Works on cotton, polyester, blends, nylon, and more', dtg: 'Best on 100% cotton, limited on polyester/blends' },
  { feature: 'Best For', dtf: 'Versatility, mixed fabric orders, small batches on any material', dtg: 'Premium cotton tees, photo-quality prints, soft hand-feel' },
  { feature: 'Setup Time', dtf: 'Fast — print film, press, done', dtg: 'Moderate — pretreat garment, load, print, heat-cure' },
  { feature: 'Detail Level', dtf: 'High — fine lines and small text reproduce well', dtg: 'Very high — best for photographic detail and gradients' },
];

const dtfBestFor = [
  'Mixed-fabric orders (cotton, polyester, and blends in the same run)',
  'Small batches with no minimums — even 1 piece is cost-effective',
  'Dark garments where you need solid, opaque white coverage',
  'Polyester performance wear, jerseys, and athletic apparel',
  'Quick turnaround — no pretreatment step means faster production',
  'Budget-conscious orders that still need full-color prints',
];

const dtgBestFor = [
  'Premium cotton t-shirts where soft hand-feel matters most',
  'Photo-quality prints with complex gradients and color transitions',
  'Eco-conscious projects — waterbased inks and less material waste',
  'On-demand / print-on-demand fulfillment workflows',
  'Light-colored garments where no white underbase is needed',
  'Designs where the ink should feel part of the fabric, not on top of it',
];

const faqs = [
  {
    q: 'Is DTF printing cheaper than DTG?',
    a: 'Yes, DTF is generally 20–40% cheaper than DTG for the same quantity and design. DTF skips the pretreatment step and prints transfers in batches, making it more efficient. For 100 t-shirts with a full-color design, DTF might cost $5–$8 per piece while DTG runs $9–$14. However, DTG may be worth the premium when soft hand-feel and print quality are priorities.',
  },
  {
    q: 'Which lasts longer — DTF or DTG?',
    a: 'Both methods are durable for everyday wear. DTF prints typically last 50+ washes and maintain their vibrancy well, though they may crack under extreme stretching. DTG prints last 40–60 washes and fade gradually rather than cracking. For longevity on cotton, they are comparable. For polyester and blends, DTF is significantly more durable because DTG ink does not bond as well to synthetic fibers.',
  },
  {
    q: 'Can DTF print on polyester?',
    a: 'Yes — this is one of DTF\'s biggest advantages. DTF transfers adhere to polyester, nylon, cotton, blends, and even some non-fabric surfaces. DTG printers, on the other hand, work best on 100% cotton and produce inconsistent results on polyester. If you need to print on performance wear, jerseys, or poly-blend hoodies, DTF is the better choice.',
  },
  {
    q: 'Does DTG feel softer than DTF?',
    a: 'Yes. DTG ink absorbs into the fabric fibers, creating a print that is nearly invisible to the touch. DTF prints sit on top of the fabric as a thin film layer, which has a slightly raised, smooth texture. For premium retail-quality shirts where hand-feel is a selling point, DTG is the superior option.',
  },
  {
    q: 'Which is better for small orders — DTF or DTG?',
    a: 'Both are excellent for small orders with no minimums. DTF has a slight edge on cost (especially for orders under 12 pieces) and works on any fabric. DTG has the edge on print quality and soft feel on cotton. For a single custom tee as a gift, either works — choose DTG for a premium cotton shirt, DTF for anything else.',
  },
  {
    q: 'Can I use DTF or DTG for a clothing brand?',
    a: 'Absolutely. Many independent clothing brands use DTF or DTG for their initial runs before scaling to screen printing. DTF is popular for brands that use mixed fabrics or want to keep costs low. DTG is popular with brands that prioritize soft, premium feel on cotton basics. Both methods produce retail-quality results.',
  },
];

export default function DtfVsDtgGuide() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/guides" className="hover:text-brand-600 transition-colors">Guides</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">DTF vs DTG Printing</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface-100 px-4 py-1.5 text-sm font-medium text-surface-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Comparison Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            DTF vs DTG Printing — Which Is Better in 2026?
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            DTF (Direct-to-Film) and DTG (Direct-to-Garment) are the two most popular methods for small-batch, full-color custom printing. This guide compares them head-to-head on cost, quality, durability, and fabric compatibility so you can pick the right one for your project.
          </p>
          <p className="text-xs text-surface-400 mt-3">Last updated: April 2026 &middot; Based on US market pricing</p>
        </header>

        {/* Quick Answer */}
        <section className="mb-14">
          <div className="rounded-xl bg-surface-100 border border-surface-200 px-6 py-5">
            <h2 className="text-lg font-bold text-surface-900 mb-2">Quick Answer</h2>
            <p className="text-sm text-surface-700 leading-relaxed">
              <strong>Choose DTF</strong> if you need to print on any fabric type, want lower costs, or need fast turnaround. <strong>Choose DTG</strong> if you are printing on 100% cotton and want the softest, most premium feel. Both methods have no minimums and produce full-color prints.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">DTF vs DTG — Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800 w-1/3">Feature</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800 w-1/3">DTF</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800 w-1/3">DTG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {comparisonData.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-surface-800 font-medium align-top">{row.feature}</td>
                    <td className="px-4 py-3 text-surface-600 align-top">{row.dtf}</td>
                    <td className="px-4 py-3 text-surface-600 align-top">{row.dtg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* When to choose DTF */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">When to Choose DTF Printing</h2>
          <div className="rounded-xl border border-surface-200 bg-white px-5 py-5">
            <p className="text-sm text-surface-600 leading-relaxed mb-4">
              DTF is the more versatile and budget-friendly option. Choose DTF when:
            </p>
            <ul className="space-y-2.5">
              {dtfBestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                  <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* When to choose DTG */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">When to Choose DTG Printing</h2>
          <div className="rounded-xl border border-surface-200 bg-white px-5 py-5">
            <p className="text-sm text-surface-600 leading-relaxed mb-4">
              DTG is the premium option for cotton-based projects. Choose DTG when:
            </p>
            <ul className="space-y-2.5">
              {dtgBestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                  <svg className="w-4 h-4 text-black shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Cost Comparison: DTF vs DTG</h2>
          <div className="rounded-xl border border-surface-200 bg-white px-5 py-5">
            <p className="text-sm text-surface-600 leading-relaxed mb-4">
              DTF is consistently cheaper than DTG across all order sizes. Here is a typical cost comparison for a full-color front design on a standard cotton tee:
            </p>
            <div className="overflow-x-auto rounded-lg border border-surface-100">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-100">
                    <th className="px-4 py-2 font-semibold text-surface-800">Quantity</th>
                    <th className="px-4 py-2 font-semibold text-surface-800">DTF Cost</th>
                    <th className="px-4 py-2 font-semibold text-surface-800">DTG Cost</th>
                    <th className="px-4 py-2 font-semibold text-surface-800">Savings with DTF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  <tr><td className="px-4 py-2 text-surface-600">1 piece</td><td className="px-4 py-2 text-surface-600">$15–$20</td><td className="px-4 py-2 text-surface-600">$18–$25</td><td className="px-4 py-2 text-surface-600 font-medium">~20%</td></tr>
                  <tr><td className="px-4 py-2 text-surface-600">12 pieces</td><td className="px-4 py-2 text-surface-600">$8–$13</td><td className="px-4 py-2 text-surface-600">$12–$18</td><td className="px-4 py-2 text-surface-600 font-medium">~30%</td></tr>
                  <tr><td className="px-4 py-2 text-surface-600">50 pieces</td><td className="px-4 py-2 text-surface-600">$5–$9</td><td className="px-4 py-2 text-surface-600">$9–$14</td><td className="px-4 py-2 text-surface-600 font-medium">~35%</td></tr>
                  <tr><td className="px-4 py-2 text-surface-600">100 pieces</td><td className="px-4 py-2 text-surface-600">$4–$8</td><td className="px-4 py-2 text-surface-600">$8–$14</td><td className="px-4 py-2 text-surface-600 font-medium">~40%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-surface-400 mt-2">* Print-only pricing on standard cotton tee. Blank garment cost additional. Prices are 2026 US market estimates.</p>
          </div>
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
          <h2 className="text-2xl font-bold text-white mb-3">Find DTF and DTG printers near you</h2>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">Compare verified printing shops that offer DTF and DTG services. Read reviews, compare pricing, and request quotes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/service/dtf-printing" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 transition-colors">
              Browse DTF Printers
            </a>
            <a href="/service/dtg-printing" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Browse DTG Printers
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
            headline: 'DTF vs DTG Printing — Which Is Better in 2026?',
            description: 'DTF vs DTG printing compared: cost, quality, durability, fabric compatibility, and minimums.',
            datePublished: '2026-04-01',
            dateModified: '2026-04-07',
            author: { '@type': 'Organization', name: 'Print Services Hub USA', url: 'https://directory.dtlaprint.com' },
            publisher: { '@type': 'Organization', name: 'Print Services Hub USA', url: 'https://directory.dtlaprint.com' },
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
              { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://directory.dtlaprint.com/guides' },
              { '@type': 'ListItem', position: 3, name: 'DTF vs DTG Printing', item: 'https://directory.dtlaprint.com/guides/dtf-vs-dtg-printing' },
            ],
          }),
        }}
      />
    </>
  );
}
