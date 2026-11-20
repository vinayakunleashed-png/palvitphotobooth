import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  CUSTOM_BOOTH_REQUESTS,
  MARQUEE_EVENTS,
  SERVICES,
} from '../data/palvitData';

interface BookingSectionProps {
  preselectedService: string;
}

interface BookingResult {
  referenceId: string;
  firstName: string;
  city: string;
  eventDate: string;
  eventType: string;
  serviceInterest: string;
}

export function BookingSection({ preselectedService }: BookingSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState(MARQUEE_EVENTS[0]);
  const [city, setCity] = useState('Mumbai');
  const [serviceInterest, setServiceInterest] = useState(
    preselectedService || SERVICES[0].name,
  );
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceInterest(preselectedService);
    }
  }, [preselectedService]);

  const buildWhatsappUrl = (refId?: string) => {
    const lines = [
      'Hello Palvit Photobooth! I would like to check availability & pricing for:',
      refId ? `- Reference: ${refId}` : null,
      `- Name: ${name.trim() || 'Guest'}`,
      `- Phone: ${phone.trim() || 'Provided'}`,
      `- Experience: ${serviceInterest}`,
      `- Event Type: ${eventType}`,
      `- City: ${city}`,
      `- Date: ${eventDate || 'To be confirmed'}`,
      message.trim() ? `- Notes: ${message.trim()}` : null,
    ].filter(Boolean);
    return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n'),
    )}`;
  };

  const buildMailtoUrl = (refId?: string) => {
    const subject = `Palvit Photobooth Booking Enquiry (${eventType} - ${city})`;
    const body = [
      refId ? `Reference: ${refId}` : '',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `Experience: ${serviceInterest}`,
      `Event Type: ${eventType}`,
      `City: ${city}`,
      `Event Date: ${eventDate}`,
      message.trim() ? `Message: ${message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `mailto:${BUSINESS_INFO.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError('Please enter your name.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!eventDate) {
      setError('Please select your event date.');
      return;
    }

    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phone.trim(),
          email: email.trim(),
          eventDate,
          city,
          eventType,
          serviceInterest,
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not log booking enquiry.');
      }

      const enquiry: BookingResult = data.enquiry;
      setConfirmation(enquiry);

      // Launch prefilled WhatsApp enquiry cleanly via anchor element (avoiding window.open)
      const waLink = document.createElement('a');
      waLink.href = buildWhatsappUrl(enquiry.referenceId);
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.click();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save right now. Please tap Chat on WhatsApp or call us directly.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 bg-[#F6F1E7] text-[#121212]"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#8A682C] mb-2.5">
            Check Availability &amp; Custom Quotes
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#121212] text-balance mb-3">
            Book Your Event Date
          </h2>
          <p className="text-base text-[#4A453E] leading-relaxed">
            Share your event date, city, and preferred booth experience. Submitting logs your reference immediately and prepares your WhatsApp message to our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form */}
          <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E2D9C8] rounded-2xl p-6 sm:p-8">
            {confirmation ? (
              <div className="space-y-6 py-2">
                {/* Micro-animated checkmark circle */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#121212] flex items-center justify-center text-[#C9A25B] shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M5 13l4 4L19 7" className="palvit-check-path" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8A682C]">
                      Enquiry Logged · {confirmation.referenceId}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#121212]">
                      Thank you, {confirmation.firstName}!
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[#4A453E] leading-relaxed">
                  We have recorded your enquiry for{' '}
                  <strong className="text-[#121212]">{confirmation.serviceInterest}</strong> ({confirmation.eventType} in {confirmation.city} on{' '}
                  {confirmation.eventDate}). Tap below if WhatsApp did not open automatically.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={buildWhatsappUrl(confirmation.referenceId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#C9A25B] hover:bg-[#D7B36E] text-[#121212] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Now</span>
                  </a>

                  <a
                    href={buildMailtoUrl(confirmation.referenceId)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#EFE9DC] hover:bg-[#E2D9C8] text-[#121212] text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4 text-[#8A682C]" />
                    <span>Send via Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setConfirmation(null)}
                    className="px-3 py-2 text-xs font-medium text-[#4A453E] hover:text-[#121212] underline underline-offset-4 cursor-pointer"
                  >
                    Edit / New Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-name" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99708 46767"
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-email" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-date" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Event Date *
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="booking-event-type" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Event Type
                    </label>
                    <select
                      id="booking-event-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    >
                      {MARQUEE_EVENTS.map((ev) => (
                        <option key={ev} value={ev}>
                          {ev}
                        </option>
                      ))}
                      <option value="School & College Event">School &amp; College Event</option>
                      <option value="Other Celebration">Other Celebration</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-city" className="block text-xs font-medium text-[#121212] mb-1.5">
                      City
                    </label>
                    <select
                      id="booking-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    >
                      {BUSINESS_INFO.cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="booking-service" className="block text-xs font-medium text-[#121212] mb-1.5">
                      Experience
                    </label>
                    <select
                      id="booking-service"
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                    >
                      <optgroup label="Featured Experiences">
                        {SERVICES.map((srv) => (
                          <option key={srv.id} value={srv.name}>
                            {srv.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Additional Booth &amp; Activity Rentals">
                        {CUSTOM_BOOTH_REQUESTS.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                      <option value="Multiple Booths / Custom Bundle">
                        Multiple Booths / Bundle
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="booking-message" className="text-xs font-medium text-[#121212]">
                      Message / Venue Details
                    </label>
                    <span className="text-[11px] text-[#6B6256] tabular-nums">
                      {message.length} / 400
                    </span>
                  </div>
                  <textarea
                    id="booking-message"
                    rows={3}
                    maxLength={400}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your venue name, hours needed, guest count, or print branding theme..."
                    className="w-full bg-white border border-[#D8CEBC] rounded-lg px-3.5 py-2.5 text-sm text-[#121212] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A25B]"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C9A25B] hover:bg-[#D7B36E] text-[#121212] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Logging Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        <span>Book &amp; Send on WhatsApp</span>
                      </>
                    )}
                  </button>

                  <a
                    href={buildMailtoUrl()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#EFE9DC] hover:bg-[#E2D9C8] text-[#121212] text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Mail className="w-4 h-4 text-[#8A682C]" />
                    <span>Send via Email</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Direct Phone & WhatsApp Contact Panel */}
          <aside className="lg:col-span-5 bg-[#121212] text-[#F6F1E7] rounded-2xl p-6 sm:p-8 space-y-6 border border-white/10">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#C9A25B] mb-2">
                Direct Line
              </p>
              <h3 className="text-3xl font-semibold text-[#F6F1E7] mb-2">
                Talk Directly With Palvit
              </h3>
              <p className="text-sm text-[#F6F1E7]/75 leading-relaxed">
                Need an immediate date check or multiple-booth wedding quote across Mumbai, Pune, or Goa? Call or message us straight away.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C9A25B] shrink-0 mt-1" />
                <div className="space-y-1.5">
                  {BUSINESS_INFO.phones.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num.replace(/\s+/g, '')}`}
                      className="block font-medium text-[#F6F1E7] hover:text-[#C9A25B] transition-colors"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C9A25B] shrink-0 mt-1" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="font-medium text-[#F6F1E7] hover:text-[#C9A25B] transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A25B] shrink-0 mt-1" />
                <p className="text-xs text-[#F6F1E7]/75 leading-relaxed">
                  {BUSINESS_INFO.address}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Palvit Photobooth! I would like to check availability for an event.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#C9A25B] hover:bg-[#D7B36E] text-[#121212] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phones[0].replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-[#F6F1E7] border border-white/15 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#C9A25B]" />
                <span>Call {BUSINESS_INFO.phones[0]}</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
