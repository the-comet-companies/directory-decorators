import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How to Order Custom T-Shirts — Step-by-Step Guide (2026)',
  description: 'Learn how to order custom t-shirts in 7 easy steps. Choose a printing method, find a printer, prepare your artwork, and get the best price. Free guide with tips from industry experts.',
  openGraph: {
    title: 'How to Order Custom T-Shirts — Step-by-Step Guide (2026)',
    description: 'Learn how to order custom t-shirts in 7 easy steps. Free guide with tips from industry experts.',
    type: 'article',
  },
  alternates: { canonical: 'https://directory.dtlaprint.com/guides/how-to-order-custom-t-shirts' },
};

const steps = [
  {
    title: 'Define Your Project',
    description: 'Before reaching out to printers, clarify your needs. How many shirts? What colors? What is the purpose — a business event, a sports team, a brand launch, or personal use? Having a clear brief saves time and money.',
    tip: 'Write down: quantity, shirt color, number of print colors, front/back printing, and your deadline.',
  },
  {
    title: 'Choose the Right Printing Method',
    description: 'The printing method determines cost, quality, and minimum order. Screen printing is cheapest for 24+ shirts with simple designs. DTG is best for full-color artwork and small batches. Embroidery adds a premium feel for logos and corporate wear.',
    tip: 'Use our printing method comparison chart on the Services page to pick the best fit.',
  },
  {
    title: 'Prepare Your Artwork',
    description: 'Most printers need your design as a high-resolution file. For screen printing, provide vector files (AI, EPS, SVG) or high-res PNG (300 DPI minimum). For DTG/DTF, any high-res image works. Many shops offer free design help if you do not have finished artwork.',
    tip: 'Vector files (.ai, .eps, .svg) give the best results. Avoid low-resolution images from the web.',
  },
  {
    title: 'Choose Your Blank Garments',
    description: 'The blank shirt matters as much as the print. Popular brands include Bella+Canvas 3001, Gildan 5000, Next Level 6210, and Comfort Colors 1717. Consider fabric weight (lightweight vs heavyweight), fit (unisex, women\'s, fitted), and material (cotton, polyester, tri-blend).',
    tip: 'Ask your printer for garment recommendations — they know which blanks work best with each print method.',
  },
  {
    title: 'Get Quotes from Multiple Printers',
    description: 'Contact 2–3 printing companies and compare quotes. Prices vary significantly based on location, method, quantity, and turnaround time. Ask about setup fees, shipping costs, and rush charges. Use Print Services Hub to find and compare printers in your area.',
    tip: 'Request a printed sample or proof before committing to a large order.',
  },
  {
    title: 'Review the Proof and Approve',
    description: 'Your printer will send a digital proof (mockup) showing how the final product will look. Check the design placement, colors, size, and spelling carefully. Once you approve the proof, production begins. Changes after approval may incur additional charges.',
    tip: 'Print the proof at actual size and hold it against a shirt to check proportions.',
  },
  {
    title: 'Place Your Order and Track Delivery',
    description: 'Confirm your order, delivery address, and timeline. Standard turnaround is 7–14 business days. Rush orders (24–72 hours) are available at most shops for an extra fee. Track your shipment and inspect the order upon arrival.',
    tip: 'Order 5–10% extra shirts to account for sizing exchanges and future needs.',
  },
];

const faqs = [
  {
    q: 'How much do custom t-shirts cost?',
    a: 'For screen printing, expect $5–$15 per shirt for 24+ pieces. DTG printing costs $10–$25 per shirt with no minimum. Embroidery runs $8–$20 per piece. Prices drop significantly with larger quantities.',
  },
  {
    q: 'What is the fastest way to get custom t-shirts?',
    a: 'DTG and heat transfer printing offer the fastest turnaround — often same-day or next-day for small orders. Screen printing rush orders can be done in 24–48 hours at most shops. Always confirm rush availability before ordering.',
  },
  {
    q: 'Can I order just one custom t-shirt?',
    a: 'Yes. DTG printing, DTF printing, and heat transfer vinyl all allow single-item orders. Screen printing and embroidery usually require a minimum of 6–24 pieces.',
  },
  {
    q: 'What file format should my design be in?',
    a: 'Vector files (AI, EPS, SVG) are ideal for screen printing. High-resolution PNG or TIFF files (300 DPI) work for DTG and DTF. Avoid JPEG compression and low-resolution images.',
  },
  {
    q: 'Should I provide my own shirts?',
    a: 'Most printers prefer to source blanks themselves to ensure print quality. However, many shops accept customer-supplied garments. Always check with your printer first — some charge extra for printing on supplied blanks.',
  },
];

export default function HowToOrderCustomTShirts() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-surface-500">
          <a href="/" className="hover:text-brand-600 transition-colors">Home</a>
          <span className="mx-2">&rsaquo;</span>
          <a href="/services" className="hover:text-brand-600 transition-colors">Services</a>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-surface-800 font-medium">How to Order Custom T-Shirts</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Step-by-Step Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
            How to Order Custom T-Shirts in 2026
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            Whether you need 10 shirts for a family reunion or 1,000 for a product launch, this guide walks you through every step — from choosing the right print method to receiving your finished order.
          </p>
        </header>

        {/* Steps */}
        <section className="mb-14">
          <ol className="space-y-8">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 mb-2">
                    Step {i + 1}: {step.title}
                  </h2>
                  <p className="text-sm text-surface-600 leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-medium text-amber-800">{step.tip}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Quick cost reference */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-surface-900 mb-4">Quick Cost Reference</h2>
          <div className="overflow-x-auto rounded-xl border border-surface-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Quantity</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Screen Print</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">DTG</th>
                  <th className="px-4 py-2.5 font-semibold text-surface-800">Embroidery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                <tr><td className="px-4 py-2.5 text-surface-600">1 shirt</td><td className="px-4 py-2.5 text-surface-400">N/A (min 12+)</td><td className="px-4 py-2.5 text-surface-600">$18–$25</td><td className="px-4 py-2.5 text-surface-400">N/A (min 6+)</td></tr>
                <tr><td className="px-4 py-2.5 text-surface-600">24 shirts</td><td className="px-4 py-2.5 text-surface-600">$10–$14/ea</td><td className="px-4 py-2.5 text-surface-600">$14–$20/ea</td><td className="px-4 py-2.5 text-surface-600">$12–$18/ea</td></tr>
                <tr><td className="px-4 py-2.5 text-surface-600">100 shirts</td><td className="px-4 py-2.5 text-surface-600">$6–$10/ea</td><td className="px-4 py-2.5 text-surface-600">$10–$16/ea</td><td className="px-4 py-2.5 text-surface-600">$9–$14/ea</td></tr>
                <tr><td className="px-4 py-2.5 text-surface-600">500 shirts</td><td className="px-4 py-2.5 text-surface-600">$4–$7/ea</td><td className="px-4 py-2.5 text-surface-600">$8–$12/ea</td><td className="px-4 py-2.5 text-surface-600">$7–$11/ea</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-surface-400 mt-2">* Prices are estimates and vary by location, design complexity, and garment brand. Request quotes from multiple printers for accurate pricing.</p>
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
          <h2 className="text-2xl font-bold text-white mb-3">Ready to order?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">Browse 596+ verified printing companies and find the best printer near you.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              Browse Printers
            </a>
            <a href="/near-me" className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Find Near Me
            </a>
          </div>
        </section>
      </div>

      <Footer />

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Order Custom T-Shirts',
            description: 'A step-by-step guide to ordering custom printed t-shirts, from choosing a printing method to receiving your finished order.',
            totalTime: 'P7D',
            estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '5-25 per shirt' },
            step: steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.title,
              text: s.description,
              tip: { '@type': 'HowToTip', text: s.tip },
            })),
          }),
        }}
      />
      {/* FAQ Schema */}
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
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://directory.dtlaprint.com' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://directory.dtlaprint.com/services' },
              { '@type': 'ListItem', position: 3, name: 'How to Order Custom T-Shirts', item: 'https://directory.dtlaprint.com/guides/how-to-order-custom-t-shirts' },
            ],
          }),
        }}
      />
    </>
  );
}
