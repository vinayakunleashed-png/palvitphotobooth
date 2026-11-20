import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, HERO_COLLAGE_FILES } from '../data/palvitData';
import { PictureMedia } from './PictureMedia';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onBookDate: () => void;
}

export function HeroSection({ onBookDate }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate LCP image using transform/scale only so First/Largest Contentful Paint is never delayed
      gsap.fromTo(
        '.hero-lcp-tile',
        { y: 14, scale: 1.03 },
        { y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
      );

      // Stagger secondary mosaic photos and hero foreground copy smoothly
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.18 });

      tl.fromTo(
        '.hero-photo-tile',
        { opacity: 0, y: 24, scale: 1.04 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
      ).fromTo(
        '.hero-copy-stagger',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        '-=0.55',
      );

      // Subtle multi-speed parallax drift on desktop collage layers
      gsap.to('.hero-parallax-slow', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.hero-parallax-fast', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
    'Hello Palvit Photobooth! I would like to check photo booth availability for an upcoming event.',
  )}`;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] bg-[#121212] text-[#F6F1E7] overflow-hidden flex items-end lg:items-center pt-24 pb-20 sm:pb-14 lg:py-24"
    >
      {/* Full-bleed responsive mosaic of real event photographs */}
      <div
        aria-hidden="true"
        className="absolute inset-0 max-w-[1600px] mx-auto px-3 sm:px-6 pt-20 pb-8 grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 pointer-events-none select-none opacity-80 lg:opacity-90"
      >
        {/* Left/Background secondary celebration shot */}
        <div className="hero-photo-tile hero-parallax-slow hidden lg:block lg:col-span-3 lg:row-span-2 self-end h-[58%] rounded-xl overflow-hidden border border-white/10">
          <PictureMedia
            imageFile={HERO_COLLAGE_FILES.eveningCouple}
            alt="Evening celebration portrait under illuminated palms"
            sizes="25vw"
            className="w-full h-full"
          />
        </div>

        {/* Top center-right wide party booth centerpiece (LCP Target — opacity always 1) */}
        <div className="hero-lcp-tile hero-parallax-fast col-span-2 lg:col-span-6 lg:col-start-6 h-[44vh] sm:h-[52vh] lg:h-[60vh] self-start rounded-xl overflow-hidden border border-white/10">
          <PictureMedia
            imageFile={HERO_COLLAGE_FILES.primaryBooth}
            alt="Guests cheering around Palvit Selfie Photo Booth with studio LED light tubes"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-full"
          />
        </div>

        {/* Bottom right Magic Mirror */}
        <div className="hero-photo-tile hero-parallax-slow col-span-1 lg:col-span-3 lg:col-start-10 self-end h-[28vh] lg:h-[44vh] rounded-xl overflow-hidden border border-white/10">
          <PictureMedia
            imageFile={HERO_COLLAGE_FILES.magicMirror}
            alt="Magic Mirror interactive photo booth touchscreen"
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="w-full h-full"
          />
        </div>

        {/* Lower strip / light-painting accents */}
        <div className="hero-photo-tile hero-parallax-fast col-span-1 lg:col-span-3 lg:col-start-7 self-end h-[26vh] lg:h-[30vh] rounded-xl overflow-hidden border border-white/10">
          <PictureMedia
            imageFile={HERO_COLLAGE_FILES.lightPainting}
            alt="Neon pink Light Painting photo booth portrait"
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Measured cinematic dark charcoal gradient overlay ensuring WCAG AA legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-[#121212]/40 lg:bg-gradient-to-r lg:from-[#121212] lg:via-[#121212]/88 lg:to-[#121212]/25"
      />

      {/* Hero Editorial Foreground */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="max-w-xl lg:max-w-2xl space-y-6">
          <p className="hero-copy-stagger text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-[#C9A25B]">
            Mumbai · Pune · Goa
          </p>

          <h1 className="hero-copy-stagger text-[clamp(2.5rem,5vw,4.35rem)] leading-[1.03] font-semibold tracking-tight text-[#F6F1E7] text-balance">
            Capturing Memories, Creating Moments.
          </h1>

          <p className="hero-copy-stagger text-base sm:text-lg text-[#F6F1E7]/85 leading-relaxed max-w-lg">
            Interactive photo booth experiences for weddings, parties and corporate events across Mumbai, Pune &amp; Goa.
          </p>

          <div className="hero-copy-stagger pt-2 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onBookDate}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#C9A25B] hover:bg-[#D7B36E] text-[#121212] text-sm font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F1E7]"
            >
              <span>Book Your Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#121212]/70 hover:bg-white/10 text-[#F6F1E7] border border-[#F6F1E7]/25 hover:border-[#C9A25B] text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap shrink-0 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A25B]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
