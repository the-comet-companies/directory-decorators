import { Provider } from '@/lib/types';

interface FeaturedProvidersProps {
  providers: Provider[];
}

export default function FeaturedProviders({ providers }: FeaturedProvidersProps) {
  if (providers.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-surface-700 uppercase tracking-wider">Featured Providers</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map(provider => (
          <a
            key={provider.id}
            href={`/provider/${provider.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-3 hover:shadow-card-hover hover:border-surface-300 transition-all duration-200 focus-ring"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-sm">
              {provider.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-surface-800 truncate group-hover:text-brand-700 transition-colors">
                {provider.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-surface-500">
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{provider.rating}</span>
                <span className="text-surface-300">·</span>
                <span>{provider.neighborhood}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
