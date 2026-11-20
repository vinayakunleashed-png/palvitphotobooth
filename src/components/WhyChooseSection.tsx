import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Layers, SlidersHorizontal, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_ITEMS, type WhyChooseItem } from '../data/palvitData';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP: Record<WhyChooseItem['key'], typeof Layers> = {
  keepsakes: Layers,
  interactive: Sparkles,
  setup: Clock,
  packages: SlidersHorizontal,
};

export function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why-block',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="py-20 md:py-28 bg-[#F6F1E7] text-[#121212] border-b border-[#E2D9C8]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#8A682C] mb-2.5">
              Why Choose Palvit Photobooth
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#121212] text-balance">
              Built for Energy, Print Craft &amp; Reliable Execution
            </h2>
          </div>

          <p className="text-sm text-[#4A453E] max-w-sm leading-relaxed">
            Whether an intimate sangeet in Pune, a luxury hotel reception in Mumbai, or a destination beach wedding in Goa, our team handles the booth start to finish.
          </p>
        </div>

        {/* 4 Benefit Blocks */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.key];
            return (
              <div
                key={item.number}
                className="why-block bg-[#FFFDF8] border border-[#E2D9C8] rounded-2xl p-6 flex flex-col justify-between gap-6"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F1E7] border border-[#E2D9C8] flex items-center justify-center text-[#8A682C]">
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-medium text-[#8A682C] tabular-nums">
                    {item.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-[#121212] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4A453E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
