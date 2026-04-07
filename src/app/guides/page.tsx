export const revalidate = 3600;

import type { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Printing Guides — Learn About Screen Printing, DTG, Embroidery & More',
  description: 'Free guides to help you choose the right printing method, understand pricing, and order custom apparel. Expert advice for businesses, events, and brands.',
  openGraph: {
    title: 'Printing Guides — Learn About Screen Printing, DTG, Embroidery & More',
    description: 'Free guides to help you choose the right printing method and order custom apparel.',
    type: 'website',
  },
  alternates: { canonical: 'https://directory.dtlaprint.com/guides' },
};

const guides = [
  {
    title: 'How Much Does Screen Printing Cost in 2026?',
    description: 'Full pricing table by quantity and color count. Learn what drives screen printing costs and how to save on your next order.',
    href: '/guides/how-much-does-screen-printing-cost',
    tag: 'Pricing Guide',
    tagColor: 'bg-black',
  },
  {
    title: 'DTF vs DTG Printing — Which Is Better in 2026?',
    description: 'Head-to-head comparison of DTF and DTG: cost, quality, durability, fabric compatibility, and best use cases.',
    href: '/guides/dtf-vs-dtg-printing',
    tag: 'Comparison',
    tagColor: 'bg-black',
  },
  {
    title: 'How to Order Custom T-Shirts',
    description: 'A 7-step guide from choosing a printing method to receiving your finished order. Includes cost breakdowns and pro tips.',
    href: '/guides/how-to-order-custom-t-shirts',
    tag: 'Step-by-Step',
    tagColor: 'bg-black',
  },
  {
    title: 'Screen Printing vs DTG — Which Is Right for You?',
    description: 'Side-by-side comparison of cost, quality, minimums, and turnaround. Find out which method fits your project.',
    href: '/guides/screen-printing-vs-dtg',
    tag: 'Comparison',
    tagColor: 'bg-black',
  },
  {
    title: 'How Much Does Custom Embroidery Cost in 2026?',
    description: 'Detailed pricing tables by stitch count and quantity. Learn what affects embroidery pricing and how to save.',
    href: '/guides/how-much-does-embroidery-cost',
    tag: 'Pricing Guide',
    tagColor: 'bg-black',
  },
];

export default function GuidesPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Free Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-3">
            Printing Guides
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed">
            Not sure which printing method to choose or how much it costs? These guides break it down in plain English — no jargon, just practical advice.
          </p>
        </div>

        {/* Guide cards */}
        <div className="space-y-4">
          {guides.map(guide => (
            <a
              key={guide.href}
              href={guide.href}
              className="group flex flex-col sm:flex-row gap-4 rounded-2xl border border-surface-200 bg-white p-6 hover:shadow-lg hover:border-surface-300 transition-all"
            >
              <div className="flex-1">
                <span className={`inline-block ${guide.tagColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-3`}>
                  {guide.tag}
                </span>
                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-brand-700 transition-colors mb-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <div className="flex items-center shrink-0">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
                  Read Guide
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-brand-600 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find a printer?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">Browse 596+ verified printing companies and compare services, pricing, and reviews.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              Browse Printers
            </a>
            <a href="/near-me" className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Find Near Me
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
