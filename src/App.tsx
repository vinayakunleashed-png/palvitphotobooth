import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Instagram, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { BUSINESS_INFO, MARQUEE_EVENTS } from './data/palvitData';
import { IMAGE_MANIFEST } from './data/imageManifest';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { MasonryGallery } from './components/MasonryGallery';
import { WhyChooseSection } from './components/WhyChooseSection';
import { BookingSection } from './components/BookingSection';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [selectedService, setSelectedService] = useState('Selfie Photo Booth');

  const lenisRef = useRef<Lenis | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  const logoMeta = IMAGE_MANIFEST[BUSINESS_INFO.logoFile];

  // Brief non-blocking page-load logo intro fade (skips on prefers-reduced-motion)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !introRef.current) {
      setIntroDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIntroDone(true),
      });
      tl.fromTo(
        '.intro-logo-mark',
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.22, ease: 'power3.out' },
      ).to(introRef.current, {
        opacity: 0,
        duration: 0.28,
        delay: 0.08,
        ease: 'power3.out',
      });
    }, introRef);

    return () => ctx.revert();
  }, []);

  // Lenis smooth scrolling synchronized with GSAP ScrollTrigger + translucent header state
  useEffect(() => {
    const handleNativeScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    handleNativeScroll();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      return () => window.removeEventListener('scroll', handleNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', () => {
      ScrollTrigger.update();
      setScrolled(lenis.scroll > 36);
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTarget = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToTarget('contact');
  };

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Why Us', id: 'why-us' },
    { label: 'Contact', id: 'contact' },
  ];

  const floatingWhatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
    'Hello Palvit Photobooth! I would like to enquire about booking a photo booth.',
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E7] text-[#121212]">
      {/* Brief page-load intro logo fade (pointer-events-none so interactions are never blocked) */}
      {!introDone && (
        <div
          ref={introRef}
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center pointer-events-none"
        >
          <div className="intro-logo-mark bg-[#F6F1E7] px-5 py-3 rounded-xl shadow-lg">
            <img
              src={logoMeta?.webp640 ?? `/images/palvit/${BUSINESS_INFO.logoFile}`}
              alt=""
              width={logoMeta?.width ?? 279}
              height={logoMeta?.height ?? 80}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Sticky Minimal Header: Logo + 4 Anchors + Gold Book Now CTA */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-[#121212]/90 backdrop-blur-md border-b border-white/10'
            : 'bg-gradient-to-b from-[#121212]/75 to-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Logo preserved clearly on warm ivory surface */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              if (lenisRef.current) lenisRef.current.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Palvit Photobooth home"
            className="inline-flex items-center bg-[#F6F1E7] px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
          >
            <img
              src={logoMeta?.webp640 ?? `/images/palvit/${BUSINESS_INFO.logoFile}`}
              alt="Palvit Photobooth logo"
              width={logoMeta?.width ?? 279}
              height={logoMeta?.height ?? 80}
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>

          {/* Zone 2: 4 Clean Single-Line Anchor Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F6F1E7]/85"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(link.id);
                }}
                className="hover:text-[#C9A25B] hover:underline underline-offset-8 decoration-[#C9A25B] decoration-2 transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Gold Book Now CTA + Mobile Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => scrollToTarget('contact')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-[#C9A25B] hover:bg-[#D7B36E] text-[#121212] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F1E7]"
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg border border-white/20 text-[#F6F1E7] hover:border-[#C9A25B] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="md:hidden bg-[#121212] border-t border-white/10 px-5 py-4 space-y-1.5"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(link.id);
                }}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#F6F1E7] hover:bg-white/10 hover:text-[#C9A25B]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* 1. Full-Screen Cinematic Real-Photo Collage Hero */}
        <HeroSection onBookDate={() => scrollToTarget('contact')} />

        {/* 2. Confirmed Event Types Trust Strip Marquee */}
        <div
          aria-label="Event types served"
          className="bg-[#181715] text-[#F6F1E7] border-y border-white/10 py-3.5 overflow-hidden select-none"
        >
          <div className="palvit-marquee-track text-xs sm:text-sm font-medium tracking-[0.14em] uppercase">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-7 px-3.5">
                {MARQUEE_EVENTS.map((ev) => (
                  <span
                    key={`${dup}-${ev}`}
                    className="inline-flex items-center gap-7 whitespace-nowrap"
                  >
                    <span>{ev}</span>
                    <span aria-hidden="true" className="text-[#C9A25B]">
                      ·
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Services Showcase */}
        <ServicesSection onSelectService={handleSelectServiceForBooking} />

        {/* 4. Animated Unretouched Masonry Gallery & Lightbox */}
        <MasonryGallery />

        {/* 5. Why Choose Palvit Photobooth (4 Honest Benefit Blocks) */}
        <WhyChooseSection />

        {/* 6. Booking Form + Prefilled WhatsApp & Direct Contact */}
        <BookingSection preselectedService={selectedService} />
      </main>

      {/* Dark Charcoal Footer (Extra bottom padding on mobile clears floating WhatsApp CTA cleanly) */}
      <footer className="bg-[#121212] text-[#F6F1E7] border-t border-white/10 pt-14 pb-24 sm:pb-14">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center bg-[#F6F1E7] px-3 py-1.5 rounded-lg">
              <img
                src={logoMeta?.webp640 ?? `/images/palvit/${BUSINESS_INFO.logoFile}`}
                alt="Palvit Photobooth logo"
                width={logoMeta?.width ?? 279}
                height={logoMeta?.height ?? 80}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="font-display text-2xl font-medium text-[#F6F1E7]">
              {BUSINESS_INFO.tagline}
            </p>
            <p className="text-xs text-[#F6F1E7]/70 leading-relaxed max-w-sm">
              Interactive photo booth experiences and custom keepsakes serving {BUSINESS_INFO.regions}.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A25B]">
              Explore
            </p>
            <ul className="space-y-2 text-[#F6F1E7]/80">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTarget(link.id);
                    }}
                    className="hover:text-[#C9A25B] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={BUSINESS_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#C9A25B] transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#C9A25B]" />
                  <span>{BUSINESS_INFO.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-sm text-[#F6F1E7]/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C9A25B]">
              Contact &amp; Studio Address
            </p>
            <div className="space-y-2">
              {BUSINESS_INFO.phones.map((num) => (
                <a
                  key={num}
                  href={`tel:${num.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-[#C9A25B] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C9A25B] shrink-0" />
                  <span>{num}</span>
                </a>
              ))}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-center gap-2 hover:text-[#C9A25B] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A25B] shrink-0" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
              <p className="flex items-start gap-2 text-xs text-[#F6F1E7]/65 leading-relaxed pt-1">
                <MapPin className="w-4 h-4 text-[#C9A25B] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#F6F1E7]/55">
          <span>
            &copy; {new Date().getFullYear()} {BUSINESS_INFO.brandName}. All rights reserved.
          </span>
          <span>Serving {BUSINESS_INFO.regions}</span>
        </div>
      </footer>

      {/* Always-visible Floating Mobile WhatsApp CTA (positioned safely with footer bottom buffer) */}
      <a
        href={floatingWhatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Palvit Photobooth on WhatsApp"
        className="md:hidden fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#C9A25B] text-[#121212] text-xs font-semibold shadow-lg border border-[#121212]/15 active:scale-95 transition-transform whitespace-nowrap"
      >
        <MessageCircle className="w-4 h-4" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
