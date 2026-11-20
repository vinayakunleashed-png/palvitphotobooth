import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '512kb' }));

interface BookingEnquiry {
  referenceId: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventDate: string;
  eventTime: string;
  durationHours: string;
  city: string;
  eventType: string;
  serviceInterest: string;
  message: string;
}

const enquiries: BookingEnquiry[] = [];

// SEO 301 Redirects preserving legacy WordPress URLs onto the single-page anchors
const LEGACY_REDIRECTS: Record<string, string> = {
  '/about-us': '/#why-us',
  '/about-us/': '/#why-us',
  '/about-page': '/#why-us',
  '/about-page/': '/#why-us',
  '/about': '/#why-us',
  '/services-page': '/#services',
  '/services-page/': '/#services',
  '/services': '/#services',
  '/events-we-cater': '/#services',
  '/events-we-cater/': '/#services',
  '/events-gallery': '/#gallery',
  '/events-gallery/': '/#gallery',
  '/gallery': '/#gallery',
  '/contact-us-2': '/#contact',
  '/contact-us-2/': '/#contact',
  '/contact': '/#contact',
  '/home-page-1': '/',
  '/home-page-1/': '/',
  '/gallery/live-steaming-of-events': '/#gallery',
  '/gallery/live-steaming-of-events/': '/#gallery',
  '/gallery/digital-mosiac': '/#gallery',
  '/gallery/digital-mosiac/': '/#gallery',
};

app.use((req, res, next) => {
  if (req.method === 'GET' && LEGACY_REDIRECTS[req.path]) {
    res.redirect(301, LEGACY_REDIRECTS[req.path]);
    return;
  }
  next();
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml\n`,
  );
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls = `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
  );
});

app.post('/api/bookings', (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    eventDate,
    eventTime,
    durationHours,
    city,
    eventType,
    serviceInterest,
    message,
  } = req.body ?? {};

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
    res.status(400).json({ error: 'Please enter your first name.' });
    return;
  }

  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 10) {
    res.status(400).json({ error: 'Please enter a valid 10-digit phone or WhatsApp number.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }

  if (!eventDate) {
    res.status(400).json({ error: 'Please choose your event date.' });
    return;
  }

  const referenceId = `PPB-${new Date().getFullYear()}-${String(101 + enquiries.length)}`;
  const record: BookingEnquiry = {
    referenceId,
    createdAt: new Date().toISOString(),
    firstName: firstName.trim(),
    lastName: String(lastName || '').trim(),
    phone: String(phone).trim(),
    email: String(email).trim(),
    eventDate: String(eventDate),
    eventTime: String(eventTime || 'Evening'),
    durationHours: String(durationHours || '4 Hours'),
    city: String(city || 'Mumbai'),
    eventType: String(eventType || 'Wedding'),
    serviceInterest: String(serviceInterest || '360 Degree Video Booth'),
    message: String(message || '').trim().slice(0, 400),
  };

  enquiries.push(record);
  res.status(201).json({ enquiry: record });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  app.use(
    '/images',
    express.static(path.resolve(__dirname, 'public/images'), {
      maxAge: '365d',
      immutable: true,
    }),
  );

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '365d',
        immutable: true,
      }),
    );
    app.use(express.static(distPath, { maxAge: '1h' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Palvit Photobooth server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
