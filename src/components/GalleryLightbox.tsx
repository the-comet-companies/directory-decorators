'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface GalleryLightboxProps {
  images: string[];
  providerName: string;
}

export default function GalleryLightbox({ images, providerName }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  const validImages = images.filter(Boolean).filter(src => !failedUrls.has(src)).slice(0, 4);
  const count = validImages.length;

  const handleImageError = (src: string) => {
    setFailedUrls(prev => new Set(prev).add(src));
  };

  const prev = useCallback(() => {
    setActiveIndex(i => (i - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const next = useCallback(() => {
    setActiveIndex(i => (i + 1) % validImages.length);
  }, [validImages.length]);

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
    setActiveIndex(index);
    setOpen(true);
  };

  const ImageButton = ({ src, alt, index, sizes, priority = false }: {
    src: string; alt: string; index: number; sizes: string; priority?: boolean;
  }) => (
    <button onClick={() => openAt(index)} className="relative block w-full h-full cursor-zoom-in overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover hover:scale-105 transition-transform duration-300"
        priority={priority}
        onError={() => handleImageError(src)}
      />
    </button>
  );

  // No images
  if (count === 0) {
    return (
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/7] bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <span className="text-5xl sm:text-7xl font-bold block">{providerName.charAt(0)}</span>
          <span className="text-lg sm:text-xl font-medium mt-3 block text-white/70">{providerName}</span>
        </div>
      </div>
    );
  }

  // 1 image
  if (count === 1) {
    return (
      <>
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/7]">
          <ImageButton src={validImages[0]} alt={providerName} index={0} sizes="100vw" priority />
        </div>
        <Lightbox images={validImages} providerName={providerName} open={open} setOpen={setOpen} activeIndex={activeIndex} setActiveIndex={setActiveIndex} prev={prev} next={next} />
      </>
    );
  }

  // 2 images — side by side
  if (count === 2) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="aspect-[4/3]">
            <ImageButton src={validImages[0]} alt={providerName} index={0} sizes="50vw" priority />
          </div>
          <div className="aspect-[4/3]">
            <ImageButton src={validImages[1]} alt={`${providerName} - 2`} index={1} sizes="50vw" />
          </div>
        </div>
        <Lightbox images={validImages} providerName={providerName} open={open} setOpen={setOpen} activeIndex={activeIndex} setActiveIndex={setActiveIndex} prev={prev} next={next} />
      </>
    );
  }

  // 3 images — 1 top full, 2 bottom
  if (count === 3) {
    return (
      <>
        <div className="grid gap-3 mb-8">
          <div className="aspect-[16/7]">
            <ImageButton src={validImages[0]} alt={providerName} index={0} sizes="100vw" priority />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[4/3]">
              <ImageButton src={validImages[1]} alt={`${providerName} - 2`} index={1} sizes="50vw" />
            </div>
            <div className="aspect-[4/3]">
              <ImageButton src={validImages[2]} alt={`${providerName} - 3`} index={2} sizes="50vw" />
            </div>
          </div>
        </div>
        <Lightbox images={validImages} providerName={providerName} open={open} setOpen={setOpen} activeIndex={activeIndex} setActiveIndex={setActiveIndex} prev={prev} next={next} />
      </>
    );
  }

  // 4 images — 2x2 grid
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="aspect-[4/3]">
          <ImageButton src={validImages[0]} alt={providerName} index={0} sizes="50vw" priority />
        </div>
        <div className="aspect-[4/3]">
          <ImageButton src={validImages[1]} alt={`${providerName} - 2`} index={1} sizes="50vw" />
        </div>
        <div className="aspect-[4/3]">
          <ImageButton src={validImages[2]} alt={`${providerName} - 3`} index={2} sizes="50vw" />
        </div>
        <div className="aspect-[4/3]">
          <ImageButton src={validImages[3]} alt={`${providerName} - 4`} index={3} sizes="50vw" />
        </div>
      </div>
      <Lightbox images={validImages} providerName={providerName} open={open} setOpen={setOpen} activeIndex={activeIndex} setActiveIndex={setActiveIndex} prev={prev} next={next} />
    </>
  );
}

function Lightbox({ images, providerName, open, setOpen, activeIndex, setActiveIndex, prev, next }: {
  images: string[];
  providerName: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  activeIndex: number;
  setActiveIndex: (v: number) => void;
  prev: () => void;
  next: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <button className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={() => setOpen(false)}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
        {activeIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={e => { e.stopPropagation(); prev(); }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative max-w-5xl w-full aspect-[16/9] mx-20" onClick={e => e.stopPropagation()}>
        <Image src={images[activeIndex]} alt={`${providerName} - photo ${activeIndex + 1}`} fill sizes="90vw" className="object-contain rounded-xl shadow-2xl" priority />
      </div>

      {images.length > 1 && (
        <button className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors" onClick={e => { e.stopPropagation(); next(); }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setActiveIndex(i); }}
              className={`h-1.5 rounded-full transition-all duration-200 ${i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
