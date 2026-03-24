export default function SEOContentBlock() {
  return (
    <section className="mt-16 border-t border-surface-200 pt-12">
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-surface-900 mb-4">
          Find the Best Printing Services in the United States
        </h2>
        <div className="prose prose-sm prose-stone text-surface-600 space-y-4 leading-relaxed">
          <p>
            The United States is home to a thriving community of custom printing professionals. Whether you need
            <strong> screen printing in California</strong>, <strong>DTG printing in New York</strong>,
            or <strong>embroidery services in Texas</strong>, Print Services Hub USA connects you with verified
            providers nationwide who deliver exceptional quality and fast turnaround times.
          </p>
          <p>
            Our directory covers every printing method — from traditional <strong>screen printing</strong> and
            precision <strong>embroidery</strong> to cutting-edge <strong>DTF transfers</strong> and
            <strong> dye sublimation</strong>. Find specialists in{' '}
            <strong>custom t-shirt printing</strong>, branded corporate merchandise, rush event
            swag, and eco-friendly sustainable printing options.
          </p>
          <p>
            Browse by state to find <strong>printing services near you</strong> across California, New York,
            Texas, Florida, Illinois, Oregon, Washington, Massachusetts, Colorado, Georgia, and more.
            Compare pricing, minimum order quantities, turnaround times, and customer reviews to find the
            perfect printing partner for your project.
          </p>

          <h3 className="text-base font-semibold text-surface-800 mt-6">Popular Printing Services in the USA</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              'Screen Printing USA',
              'Custom T-Shirts Nationwide',
              'DTG Printing Near Me',
              'Embroidery Services',
              'DTF Printing',
              'Rush T-Shirt Printing',
              'Bulk Order Printing',
              'Corporate Merch',
              'Eco-Friendly Printing',
              'Sublimation Printing',
              'Custom Hoodies',
              'Tote Bag Printing',
            ].map(term => (
              <span
                key={term}
                className="rounded-full border border-surface-200 bg-white px-3 py-1 text-xs font-medium text-surface-600 hover:border-brand-300 hover:text-brand-700 transition-colors cursor-pointer"
              >
                {term}
              </span>
            ))}
          </div>

          <h3 className="text-base font-semibold text-surface-800 mt-6">States We Cover</h3>
          <p>
            Alaska · California · Colorado · Connecticut · Florida · Georgia · Hawaii ·
            Illinois · Kansas · Maine · Massachusetts · Michigan · Minnesota · Missouri ·
            Nebraska · Nevada · New Hampshire · New Jersey · New York · Ohio · Oregon ·
            Pennsylvania · Rhode Island · Texas · Vermont · Washington
          </p>
        </div>
      </div>
    </section>
  );
}
