'use client';

import { useState, useEffect, useCallback } from 'react';

interface GalleryLightboxProps {
  images: string[];
  providerName: string;
  gradients: string[];
  neighborhood: string;
}

export default function GalleryLightbox({ images, providerName, gradients, neighborhood }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const allImages = images.filter(Boolean);

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  const openAt = (index: number) => {
    if (!allImages[index]) return;
    setActiveIndex(index);
    setOpen(true);
  };

  const coverSrc = allImages[0] || null;

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {/* Main / cover image */}
        <div className="col-span-2 md:row-span-2 aspect-[4/3] rounded-2xl overflow-hidden">
          {coverSrc ? (
            <button onClick={() => openAt(0)} className="block w-full h-full cursor-zoom-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverSrc}
                alt={providerName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradients[0]} flex items-center justify-center`}>
              <div className="text-center text-white">
                <span className="text-6xl font-bold block">{providerName.charAt(0)}</span>
                <span className="text-sm font-medium mt-2 block opacity-75">{neighborhood}</span>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails 1-4 */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden hidden md:block">
            {allImages[i] ? (
              <button onClick={() => openAt(i)} className="block w-full h-full cursor-zoom-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={allImages[i]}
                  alt={`${providerName} - photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white/60">{i}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {activeIndex + 1} / {allImages.length}
          </div>

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-5xl max-h-[85vh] px-20" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeIndex]}
              alt={`${providerName} - photo ${activeIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Next */}
          {allImages.length > 1 && (
            <button
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
