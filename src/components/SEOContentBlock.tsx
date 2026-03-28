export default function SEOContentBlock() {
  return (
    <section className="mt-16 border-t border-surface-200 pt-12">
      <div className="w-full">
        <h2 className="text-xl font-bold text-surface-900 mb-4">
          Find the Best Printing Services in the United States
        </h2>
        <div className="prose prose-sm prose-stone text-surface-600 space-y-4 leading-relaxed">
          <p>
            The United States is home to a thriving community of custom printing professionals. Whether you need
            <a href="/state/california" className="font-bold text-surface-800 hover:text-brand-600 transition-colors"> screen printing in California</a>, <a href="/state/new-york" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">DTG printing in New York</a>,
            or <a href="/state/texas" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">embroidery services in Texas</a>, Print Services Hub USA connects you with verified
            providers nationwide who deliver exceptional quality and fast turnaround times.
          </p>
          <p>
            Our directory covers every printing method — from traditional <a href="/service/screen-printing" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">screen printing</a> and
            precision <a href="/service/embroidery" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">embroidery</a> to cutting-edge <a href="/service/dtf-printing" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">DTF transfers</a> and
            <a href="/service/sublimation" className="font-bold text-surface-800 hover:text-brand-600 transition-colors"> dye sublimation</a>. Find specialists in{' '}
            <a href="/service/custom-apparel" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">custom t-shirt printing</a>, branded corporate merchandise, rush event
            swag, and eco-friendly sustainable printing options.
          </p>
          <p>
            Browse by state to find <a href="/near-me" className="font-bold text-surface-800 hover:text-brand-600 transition-colors">printing services near you</a> across California, New York,
            Texas, Florida, Illinois, Oregon, Washington, Massachusetts, Colorado, Georgia, and more.
            Compare pricing, minimum order quantities, turnaround times, and customer reviews to find the
            perfect printing partner for your project.
          </p>

          <h3 className="text-base font-semibold text-surface-800 mt-6">Popular Printing Services in the USA</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: 'Screen Printing', href: '/service/screen-printing' },
              { label: 'DTG Printing', href: '/service/dtg-printing' },
              { label: 'Embroidery Services', href: '/service/embroidery' },
              { label: 'DTF Printing', href: '/service/dtf-printing' },
              { label: 'Sublimation Printing', href: '/service/sublimation' },
              { label: 'Heat Transfer', href: '/service/heat-transfer' },
              { label: 'Custom Apparel', href: '/service/custom-apparel' },
              { label: 'Large Format Printing', href: '/service/large-format-printing' },
              { label: 'Vinyl Printing', href: '/service/vinyl-printing' },
              { label: 'Rush Printing', href: '/?rushAvailable=true' },
              { label: 'Eco-Friendly Printing', href: '/?ecoFriendly=true' },
              { label: 'Find Near Me', href: '/near-me' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full border border-surface-200 bg-white px-3 py-1 text-sm font-medium text-surface-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <h3 className="text-base font-semibold text-surface-800 mt-6">States We Cover</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-2 mt-3 w-full justify-between">
            {[
              { label: 'Alaska', slug: 'alaska' },
              { label: 'California', slug: 'california' },
              { label: 'Colorado', slug: 'colorado' },
              { label: 'Connecticut', slug: 'connecticut' },
              { label: 'Florida', slug: 'florida' },
              { label: 'Georgia', slug: 'georgia' },
              { label: 'Hawaii', slug: 'hawaii' },
              { label: 'Illinois', slug: 'illinois' },
              { label: 'Kansas', slug: 'kansas' },
              { label: 'Maine', slug: 'maine' },
              { label: 'Massachusetts', slug: 'massachusetts' },
              { label: 'Michigan', slug: 'michigan' },
              { label: 'Minnesota', slug: 'minnesota' },
              { label: 'Missouri', slug: 'missouri' },
              { label: 'Nebraska', slug: 'nebraska' },
              { label: 'Nevada', slug: 'nevada' },
              { label: 'New Hampshire', slug: 'new-hampshire' },
              { label: 'New Jersey', slug: 'new-jersey' },
              { label: 'New York', slug: 'new-york' },
              { label: 'Ohio', slug: 'ohio' },
              { label: 'Oregon', slug: 'oregon' },
              { label: 'Pennsylvania', slug: 'pennsylvania' },
              { label: 'Rhode Island', slug: 'rhode-island' },
              { label: 'Texas', slug: 'texas' },
              { label: 'Vermont', slug: 'vermont' },
              { label: 'Washington', slug: 'washington' },
            ].map(state => (
              <a
                key={state.slug}
                href={`/state/${state.slug}`}
                className="text-sm text-surface-600 hover:text-brand-600 transition-colors"
              >
                {state.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
