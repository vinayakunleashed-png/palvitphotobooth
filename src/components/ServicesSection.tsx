import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { SERVICES, type ServiceItem } from '../data/palvitData';
import { PictureMedia } from './PictureMedia';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

type ServiceCategoryFilter =
  | 'all'
  | 'photo-print'
  | 'motion-video'
  | 'interactive-craft';

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryFilter>('all');
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const visibleServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.service-card-anim');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: container,
            start: 'top 86%',
            once: true,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [activeCategory]);

  const filterTabs: { id: ServiceCategoryFilter; label: string }[] = [
    { id: 'all', label: `All Experiences (${SERVICES.length})` },
    { id: 'photo-print', label: 'Photo & Print' },
    { id: 'motion-video', label: '360° & Motion' },
    { id: 'interactive-craft', label: 'Interactive & Craft' },
  ];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-20 md:py-28 bg-[#F6F1E7] text-[#121212] border-b border-[#E2D9C8]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#8A682C] mb-2.5">
              Curated Photo Booths &amp; Event Activities
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#121212] text-balance">
              Experiences Crafted for Live Celebrations
            </h2>
          </div>

          <p className="text-sm text-[#4A453E] max-w-sm leading-relaxed">
            Every setup is customized with your wedding monogram, party theme, or brand identity and operated onsite by our crew.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EAE2D3] rounded-xl w-fit mb-10">
          {filterTabs.map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212] ${
                  active
                    ? 'bg-[#121212] text-[#F6F1E7]'
                    : 'text-[#4A453E] hover:text-[#121212]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Mobile snap hint */}
        <p className="sm:hidden text-xs font-medium text-[#8A682C] mb-3">
          Swipe across cards to browse experiences →
        </p>

        {/* Mobile horizontal snap rail -> Desktop staggered editorial grid */}
        <div
          ref={gridRef}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-6 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar"
        >
          {visibleServices.map((service: ServiceItem, idx: number) => {
            const desktopStaggerOffset = idx % 3 === 1 ? 'lg:translate-y-6' : '';

            return (
              <article
                key={service.id}
                className={`service-card-anim ${desktopStaggerOffset} group w-[82vw] max-w-[330px] sm:w-auto sm:max-w-none shrink-0 snap-start bg-[#FFFDF8] border border-[#E2D9C8] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-500 ease-out hover:-translate-y-1.5`}
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181715] border-b border-[#E2D9C8]">
                    <PictureMedia
                      imageFile={service.imageFile}
                      alt={service.imageAlt}
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full"
                      imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212]/75 via-[#121212]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                    >
                      <span className="font-display text-xl font-semibold text-[#F6F1E7] translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        {service.name}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-medium text-[#8A682C] mb-1.5">
                      {service.categoryLabel}
                    </p>
                    <h3 className="text-2xl font-semibold text-[#121212] mb-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#4A453E] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#EFE9DC]">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.name)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#121212] group-hover:text-[#8A682C] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B] rounded"
                  >
                    <span>Check availability</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
