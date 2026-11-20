import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { GALLERY_PHOTOS, type GalleryPhoto } from '../data/palvitData';
import { IMAGE_MANIFEST } from '../data/imageManifest';
import { PictureMedia } from './PictureMedia';

gsap.registerPlugin(ScrollTrigger);

type GalleryFilter =
  | 'All'
  | 'Photo Booths & Strips'
  | 'Weddings & Portraits'
  | 'Celebrations & Corporate';

export function MasonryGallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [columnCount, setColumnCount] = useState(3);

  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const filteredPhotos = useMemo(() => {
    return activeFilter === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  // Keep true column count synced with viewport breakpoints (1 col <640, 2 col 640-1023, 3 col >=1024)
  useEffect(() => {
    const syncCols = () => {
      if (window.innerWidth < 640) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else setColumnCount(3);
    };
    syncCols();
    window.addEventListener('resize', syncCols);
    return () => window.removeEventListener('resize', syncCols);
  }, []);

  // Distribute photos evenly across masonry columns preserving exact order left-to-right
  const columns = useMemo(() => {
    const cols: { photo: GalleryPhoto; flatIndex: number }[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    filteredPhotos.forEach((photo, idx) => {
      cols[idx % columnCount].push({ photo, flatIndex: idx });
    });
    return cols;
  }, [filteredPhotos, columnCount]);

  // GSAP scroll reveals (mixed clip-path wipes & staggered fade-ups) + differential column parallax
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>('.gallery-tile-reveal');
      tiles.forEach((tile, index) => {
        const variant = index % 4;
        const fromVars: gsap.TweenVars =
          variant === 0
            ? { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.25, y: 24 }
            : variant === 1
              ? { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.25, x: -16 }
              : variant === 2
                ? { clipPath: 'polygon(0% 0%, 0% 0%, -35% 100%, -35% 100%)', opacity: 0.25, scale: 1.04 }
                : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0, y: 32 };

        const toVars: gsap.TweenVars =
          variant === 2
            ? {
                clipPath: 'polygon(0% 0%, 140% 0%, 100% 100%, 0% 100%)',
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.85,
                delay: (index % 3) * 0.09,
                ease: 'power3.out',
                clearProps: 'clipPath,transform,opacity',
              }
            : {
                clipPath: 'inset(0% 0% 0% 0%)',
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                delay: (index % 3) * 0.09,
                ease: 'power3.out',
                clearProps: 'clipPath,transform,opacity',
              };

        gsap.fromTo(tile, fromVars, {
          ...toVars,
          scrollTrigger: {
            trigger: tile,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // Gentle per-column differential parallax on multi-column viewports
      if (columnCount >= 3) {
        const colNodes = gsap.utils.toArray<HTMLElement>('.masonry-col-parallax');
        colNodes.forEach((col, colIdx) => {
          const shift = colIdx === 1 ? -4 : colIdx === 2 ? 3 : 0;
          if (shift === 0) return;
          gsap.to(col, {
            yPercent: shift,
            ease: 'none',
            scrollTrigger: {
              trigger: grid,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }
    }, grid);

    return () => ctx.revert();
  }, [activeFilter, columnCount]);

  // Lightbox entrance transition & keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    if (
      lightboxRef.current &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' },
      );
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length,
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length,
        );
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredPhotos.length]);

  const handleCursorOrigin = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const yPct = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transformOrigin = `${xPct}% ${yPct}%`;
    }
  };

  const resetCursorOrigin = (e: React.PointerEvent<HTMLButtonElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.transformOrigin = 'center center';
    }
  };

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;
  const activeMeta = activePhoto ? IMAGE_MANIFEST[activePhoto.imageFile] : null;

  const filterOptions: GalleryFilter[] = [
    'All',
    'Photo Booths & Strips',
    'Weddings & Portraits',
    'Celebrations & Corporate',
  ];

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-20 md:py-28 bg-[#121212] text-[#F6F1E7] border-b border-white/10"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        {/* Editorial Heading & Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#C9A25B] mb-2.5">
              Unretouched Event Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#F6F1E7] text-balance">
              Moments Captured Live Across Real Events
            </h2>
          </div>

          <p className="text-sm text-[#F6F1E7]/70 max-w-sm leading-relaxed">
            Every frame appears in its natural portrait or landscape aspect ratio—click any photograph to inspect full screen.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div
          role="tablist"
          aria-label="Gallery category filter"
          className="flex flex-wrap items-center gap-2 mb-12"
        >
          {filterOptions.map((cat) => {
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveFilter(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B] ${
                  active
                    ? 'bg-[#C9A25B] text-[#121212] border-[#C9A25B]'
                    : 'bg-white/5 text-[#F6F1E7]/80 border-white/15 hover:border-[#C9A25B]/60 hover:text-[#F6F1E7]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Multi-column Masonry Grid preserving original aspect ratios */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
        >
          {columns.map((colItems, colIdx) => (
            <div
              key={`${activeFilter}-col-${colIdx}`}
              className={`masonry-col-parallax space-y-5 ${
                colIdx === 1 ? 'lg:mt-8' : ''
              }`}
            >
              {colItems.map(({ photo, flatIndex }) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(flatIndex)}
                  onPointerMove={handleCursorOrigin}
                  onPointerLeave={resetCursorOrigin}
                  className="gallery-tile-reveal group relative block w-full text-left rounded-xl overflow-hidden border border-white/10 bg-[#1B1A18] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                >
                  <PictureMedia
                    imageFile={photo.imageFile}
                    alt={photo.alt}
                    preserveNaturalAspect
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  />

                  {/* Subtle top-right expand affordance */}
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121212]/70 backdrop-blur-sm border border-white/15 flex items-center justify-center text-[#F6F1E7] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Expand className="w-3.5 h-3.5" />
                  </span>

                  {/* Caption overlay on hover */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/45 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                    <p className="text-[11px] font-medium tracking-wide text-[#C9A25B]">
                      {photo.category}
                    </p>
                    <p className="text-sm font-medium text-[#F6F1E7]">{photo.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard & Swipe Accessible Lightbox */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.caption}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const startX = touchStartXRef.current;
            const endX = e.changedTouches[0]?.clientX ?? null;
            touchStartXRef.current = null;
            if (startX === null || endX === null) return;
            const delta = endX - startX;
            if (Math.abs(delta) > 45) {
              if (delta < 0) {
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
              } else {
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
                );
              }
            }
          }}
          className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between gap-4 text-[#F6F1E7]">
            <div>
              <p className="text-xs font-medium text-[#C9A25B]">{activePhoto.category}</p>
              <p className="font-display text-xl sm:text-2xl font-semibold">
                {activePhoto.caption}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close photograph viewer"
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F6F1E7] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stage */}
          <div
            ref={lightboxRef}
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4"
          >
            <button
              type="button"
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
                )
              }
              aria-label="Previous photograph"
              className="absolute left-1 sm:left-3 z-10 p-3 rounded-full bg-[#121212]/80 hover:bg-[#C9A25B] hover:text-[#121212] text-[#F6F1E7] border border-white/20 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="max-h-[72vh] max-w-full flex items-center justify-center overflow-hidden rounded-xl">
              <img
                key={activePhoto.id}
                src={activeMeta ? activeMeta.original : `/images/palvit/${activePhoto.imageFile}`}
                alt={activePhoto.alt}
                width={activeMeta?.width}
                height={activeMeta?.height}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
              }
              aria-label="Next photograph"
              className="absolute right-1 sm:right-3 z-10 p-3 rounded-full bg-[#121212]/80 hover:bg-[#C9A25B] hover:text-[#121212] text-[#F6F1E7] border border-white/20 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Counter & Hint */}
          <div className="w-full max-w-5xl flex items-center justify-between text-xs text-[#F6F1E7]/65">
            <span>{activePhoto.alt}</span>
            <span className="tabular-nums shrink-0 ml-4">
              {lightboxIndex + 1} / {filteredPhotos.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
