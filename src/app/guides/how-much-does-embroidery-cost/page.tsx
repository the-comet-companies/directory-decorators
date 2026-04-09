import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How Much Does Custom Embroidery Cost in 2026? — Pricing Guide',
  description: 'Custom embroidery costs $5–$20 per piece for orders of 24+. See our full pricing table by stitch count and quantity, plus tips to save money on embroidered polos, caps, and jackets.',
  openGraph: {
    title: 'How Much Does Custom Embroidery Cost in 2026? — Pricing Guide',
    description: 'Custom embroidery pricing breakdown by stitch count, quantity, and garment type. Realistic 2026 US market rates.',
    type: 'article',
  },
  alternates: { canonical: 'https://directory.shoptitan.app/guides/how-much-does-embroidery-cost' },
};

const pricingData = [
  { qty: '6 pieces', simple: '$15–$20', medium: '$18–$25', large: '$22–$30' },
  { qty: '12 pieces', simple: '$12–$17', medium: '$15–$22', large: '$18–$27' },
  { qty: '24 pieces', simple: '$8–$13', medium: '$11–$17', large: '$14–$22' },
  { qty: '48 pieces', simple: '$6–$10', medium: '$9–$14', large: '$12–$18' },
  { qty: '100 pieces', simple: '$5–$8', medium: '$7–$12', large: '$10–$15' },
  { qty: '500 pieces', simple: '$3.50–$6', medium: '$5.50–$9', large: '$8–$12' },
];

const pricingFactors = [
  {
    title: 'Stitch Count',
    description: 'Stitch count is the single biggest factor in embroidery pricing. A simple logo with 5,000 stitches takes far less machine time than a detailed design with 15,000+ stitches. Most shops price primarily on stitch count rather than design dimensions.',
  },
  {
    title: 'Number of Thread Colors',
    description: 'Each thread color requires a machine stop to change spools. Designs with 1–3 colors run faster and cost less. Designs with 6+ colors add $0.50–$2.00 per piece due to extra setup and run time.',
  },
  {
    title: 'Garment Type',
    description: 'Polos and t-shirts are the easiest to embroider and the cheapest. Caps and beanies require special hooping equipment and run slower, adding $1–$3 per piece. Jackets, bags, and thick outerwear are the most expensive due to heavy materials and complex hooping.',
  },
  {
    title: 'Number of Embroidery Locations',
    description: 'Each additional location (left chest, back, sleeve, collar) requires re-hooping the garment and a separate machine run. Left chest only is standard; adding a second location typically adds 50–75% of the first location cost.',
  },
  {
    title: 'Digitizing Fees',
    description: 'Before any design can be embroidered, it must be converted into a stitch file — a process called digitizing. Expect a one-time fee of $30–$75 for simple logos and $75–$150+ for complex artwork. Many shops waive digitizing for orders over 48 pieces.',
  },
  {
    title: 'Rush Charges',
    description: 'Standard turnaround for embroidery is 7–14 business days. Need it faster? Rush fees of 20–50% apply for 3–5 day turnaround, and same-day or next-day embroidery (where available) can double the per-piece cost.',
  },
];

const savingTips = [
  {
    title: 'Simplify Your Design',
    description: 'Reduce stitch count by removing unnecessary detail, gradients, and small text. A clean, bold logo embroiders better and costs less. Ask your embroiderer to optimize the design — they can often cut 20–30% of stitches without changing the look.',
  },
  {
    title: 'Order in Larger Quantities',
    description: 'Per-piece pricing drops dramatically between 12 and 48 pieces, and again at 100+. If you know you will reorder, placing one larger order is significantly cheaper than two smaller ones.',
  },
  {
    title: 'Stick to Fewer Locations',
    description: 'A single left-chest embroidery is the most cost-effective placement. Each additional location (back, sleeve, collar) adds a separate setup and run charge. If budget is tight, one well-placed logo is better than three.',
  },
  {
    title: 'Supply Your Own Garments',
    description: 'Some shops allow you to provide your own blank garments, which can save money if you have a wholesale account or existing inventory. Confirm with your embroiderer first — not all shops accept customer-supplied blanks, and some charge a handling fee.',
  },
  {
    title: 'Ask About Setup Fee Waivers for Large Orders',
    description: 'Digitizing and setup fees are one-time costs that hurt small orders disproportionately. For orders of 48+ pieces, many shops will waive or discount the setup fee. Always ask — it never hurts to negotiate on larger runs.',
  },
];

const faqs = [
  {
    q: 'How much does it cost to embroider a logo on a polo shirt?',
    a: 'A standard left-chest logo (5,000–8,000 stitches) on a polo shirt typically costs $8–$15 per piece for orders of 24+. For smaller orders of 6–12, expect $12–$20 per piece. These prices include embroidery only — the blank polo is additional, usually $8–$20 depending on the brand.',
  },
  {
    q: 'Is there a setup fee for embroidery?',
    a: 'Yes. Most embroidery shops charge a one-time digitizing fee of $30–$75 to convert your artwork into a machine-readable stitch file. This fee is charged once and the file is kept on record for future orders. Many shops waive digitizing for large orders (48+ pieces).',
  },
  {
    q: 'How much does hat embroidery cost?',
    a: 'Hat and cap embroidery typically costs $2–$5 more per piece than flat goods (shirts, polos) due to specialized hooping equipment and slower run speeds. Expect $10–$18 per cap for orders of 24+ with a standard front logo. Structured caps are easier to embroider than unstructured or low-profile styles.',
  },
  {
    q: 'What is the minimum order for custom embroidery?',
    a: 'Most embroidery shops have a minimum order of 6–12 pieces due to the setup time involved. Some shops offer single-piece embroidery but at a higher per-unit cost ($20–$35+). For the best pricing, order 24 or more pieces.',
  },
  {
    q: 'Is embroidery more expensive than screen printing?',
    a: 'Generally, yes. Embroidery costs 20–40% more than screen printing for comparable orders. However, embroidery offers a premium, textured look that lasts the life of the garment. For corporate wear, uniforms, and professional branding, the extra cost is usually worth the quality difference.',
  },
];

export default function EmbroideryPricingGuide() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/services" className="hover:text-brand-600 transition-colors">Services</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">Embroidery Cost Guide</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Pricing Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            How Much Does Custom Embroidery Cost in 2026?
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            From polo shirts and caps to jackets and bags, embroidery is the gold standard for professional branding. This guide breaks down real-world pricing so you can budget accurately and get the best value on your next embroidery order.
          </p>
        </header>

        {/* Quick Answer */}
        <section className="mb-14">
          <div className="rounded-xl bg-brand-50 border border-brand-200 px-6 py-5">
            <h2 className="text-lg font-bold text-brand-800 mb-2">Quick Answer</h2>
            <p className="text-sm text-brand-700 leading-relaxed">
              Custom embroidery typically costs <strong>$5–$20 per piece</strong> for orders of 24+. Pricing depends on stitch count, garment type, quantity, and number of embroidery locations. A one-time digitizing fee of $30–$75 applies for new designs.
            </p>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Embroidery Pricing by Quantity &amp; Stitch Count</h2>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Quantity</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Simple Logo (5K stitches)</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Medium Design (10K stitches)</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Large Design (15K+ stitches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {pricingData.map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-surface-600 font-medium">{row.qty}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.simple}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.medium}</td>
                    <td className="px-4 py-2.5 text-surface-600">{row.large}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-surface-400 mt-2">* Per-piece pricing for embroidery only. Blank garment cost is additional. Prices are 2026 US market estimates and vary by shop, location, and garment type.</p>
        </section>

        {/* What Affects Pricing */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-6">What Affects Embroidery Pricing?</h2>
          <div className="space-y-5">
            {pricingFactors.map((factor, i) => (
              <div key={i} className="rounded-xl border border-surface-200 bg-white px-5 py-4">
                <h3 className="text-sm font-semibold text-surface-900 mb-1.5">{factor.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{factor.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Embroidery vs Screen Printing */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Embroidery vs Screen Printing Cost</h2>
          <div className="rounded-xl border border-surface-200 bg-white px-5 py-5">
            <p className="text-sm text-surface-600 leading-relaxed mb-4">
              Screen printing is generally 20–40% cheaper per piece than embroidery for the same quantity. For 100 t-shirts with a one-color logo, screen printing might cost $6–$10 per piece while embroidery runs $8–$14 per piece.
            </p>
            <p className="text-sm text-surface-600 leading-relaxed mb-4">
              <strong className="text-surface-800">When embroidery is worth the extra cost:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-surface-600 space-y-1.5 ml-1">
              <li>Corporate uniforms and professional branding — embroidery conveys quality and lasts longer</li>
              <li>Polos, caps, and jackets — these garments look best with embroidered logos</li>
              <li>Small orders (under 24) — screen printing setup fees make it expensive at low quantities, while embroidery setup is similar regardless of method</li>
              <li>Durability matters — embroidery will not crack, peel, or fade like printed designs can over time</li>
              <li>Premium gifting and client-facing merchandise — the textured, stitched look signals higher value</li>
            </ul>
          </div>
        </section>

        {/* How to Save Money */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-6">How to Save Money on Embroidery</h2>
          <ol className="space-y-4">
            {savingTips.map((tip, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold shrink-0 mt-0.5">
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
        <section className="mb-10 rounded-2xl bg-brand-600 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get embroidery pricing?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">Browse verified embroidery shops or find the best printer near you.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/service/embroidery" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              Find Embroidery Shops
            </a>
            <a href="/near-me" className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Find Near Me
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
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.shoptitan.app' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://directory.shoptitan.app/services' },
              { '@type': 'ListItem', position: 3, name: 'Embroidery Cost Guide', item: 'https://directory.shoptitan.app/guides/how-much-does-embroidery-cost' },
            ],
          }),
        }}
      />
    </>
  );
}
