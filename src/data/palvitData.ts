export interface ServiceItem {
  id: string;
  name: string;
  category: 'photo-print' | 'motion-video' | 'interactive-craft';
  categoryLabel: string;
  shortDescription: string;
  imageFile: string;
  imageAlt: string;
}

export interface GalleryPhoto {
  id: string;
  imageFile: string;
  alt: string;
  category: 'Photo Booths & Strips' | 'Weddings & Portraits' | 'Celebrations & Corporate';
  caption: string;
}

export interface WhyChooseItem {
  number: string;
  key: 'keepsakes' | 'interactive' | 'setup' | 'packages';
  title: string;
  description: string;
}

export const BUSINESS_INFO = {
  brandName: 'Palvit Photobooth',
  tagline: 'Capturing Memories, Creating Moments.',
  logoFile: 'logo.png',
  regions: 'Mumbai, Pune & Goa',
  cities: ['Mumbai', 'Pune', 'Goa', 'Other Destination'],
  phones: ['+91 99708 46767', '+91 83291 39276'],
  whatsappNumber: '919970846767',
  email: 'palvitarts@gmail.com',
  instagramHandle: '@palvit_photobooth',
  instagramUrl: 'https://www.instagram.com/palvit_photobooth/',
  address:
    'Nirvana Beyond by Diamond Nexus Properties, E-Wing, Flat No – 406, Kiwale Rd, Kiwale, Ravet, Pimpri-Chinchwad, Maharashtra 412101',
};

export const MARQUEE_EVENTS = [
  'Weddings',
  'Birthdays',
  'Corporate',
  'Sangeet',
  'Engagements',
  'Brand Activations',
];

export const HERO_COLLAGE_FILES = {
  primaryBooth: 'event-gallery-6.jpg',
  magicMirror: 'magic-mirror.jpg',
  eveningCouple: 'event-strip-6.jpeg',
  lightPainting: 'light-painting.jpg',
  partyStrip: 'event-hero-1.jpg',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'selfie-photo-booth',
    name: 'Selfie Photo Booth',
    category: 'photo-print',
    categoryLabel: 'Photo & Print',
    shortDescription:
      'Open-air studio-lit selfie station with custom multi-pose print templates, themed party props, and instant digital sharing.',
    imageFile: 'selfie-booth.jpeg',
    imageAlt: 'Baby Shower custom 4-pose photo strip print created at Palvit Selfie Photo Booth',
  },
  {
    id: 'magic-mirror',
    name: 'Magic Mirror',
    category: 'photo-print',
    categoryLabel: 'Photo & Print',
    shortDescription:
      'Full-length interactive touchscreen mirror guiding guests with animations, on-screen signing, and instant prints.',
    imageFile: 'magic-mirror.jpg',
    imageAlt: 'Guest interacting with the illuminated touchscreen Magic Mirror photo booth by Palvit Photobooth',
  },
  {
    id: 'gif-booth',
    name: 'GIF Booth',
    category: 'motion-video',
    categoryLabel: '360° & Motion',
    shortDescription:
      'Rapid-burst animated GIF capture with party props and custom graphics ready for instant sharing.',
    imageFile: 'gif-photo-booth.gif',
    imageAlt: 'Animated GIF burst session with oversized party sunglasses and props at Palvit GIF Booth',
  },
  {
    id: 'boomerang-booth',
    name: 'Boomerang Booth',
    category: 'motion-video',
    categoryLabel: '360° & Motion',
    shortDescription:
      'Looping forward-and-reverse video clips built for energetic prop tosses, confetti moments, and story sharing.',
    imageFile: 'event-gallery-6.jpg',
    imageAlt: 'Guests celebrating around Palvit Photobooth ring-lit Boomerang setup with studio LED light tubes',
  },
  {
    id: 'light-painting',
    name: 'Light Painting',
    category: 'interactive-craft',
    categoryLabel: 'Interactive & Craft',
    shortDescription:
      'Dark-enclosure long-exposure photography where guests draw glowing light trails and shapes live in frame.',
    imageFile: 'light-painting.jpg',
    imageAlt: 'Guest smiling inside pink neon light trail at Palvit Light Painting Photo Booth',
  },
  {
    id: 'word-cloud-photo-booth',
    name: 'Word Cloud Photo Booth',
    category: 'interactive-craft',
    categoryLabel: 'Interactive & Craft',
    shortDescription:
      'Transforms guest portraits into expressive typographic word-cloud artwork built around meaningful keywords.',
    imageFile: 'word-cloud-booth.png',
    imageAlt: 'Side-by-side portrait and typographic word-cloud print sample by Palvit Photobooth',
  },
  {
    id: 'hashtag-photo-booth',
    name: 'HashTag Photo Booth',
    category: 'photo-print',
    categoryLabel: 'Photo & Print',
    shortDescription:
      'Turns event social hashtags into instant printed keepsakes and live photo feeds during weddings and launches.',
    imageFile: 'hashtag-booth.jpg',
    imageAlt: 'Custom HashTag photo booth prop kit created for celebration social sharing',
  },
  {
    id: 'digital-caricature',
    name: 'Digital Caricature',
    category: 'interactive-craft',
    categoryLabel: 'Interactive & Craft',
    shortDescription:
      'Live digital portrait illustration station with mirrored screen display and instant branded souvenir prints.',
    imageFile: 'digital-caricature.jpg',
    imageAlt: 'Live Digital Caricature artist drawing couple portraits on display easel at event',
  },
];

export const CUSTOM_BOOTH_REQUESTS = [
  '360 Degree Video Booth',
  'Strip Photo Booth',
  'Virtual Photo Booth',
  'Digital Mosaic',
  'Live Streaming of Events',
  'Green Screen / Chroma',
  '180 Degree Freeze',
  'Anti Gravity',
  'Bobble Head Activity',
  'Magazine Photo Booth',
  'Wax Hand',
  'VR Games on Rent',
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'g1',
    imageFile: 'event-gallery-6.jpg',
    alt: 'Guests cheering around ring-lit booth setup with vertical studio LED light tubes',
    category: 'Photo Booths & Strips',
    caption: 'LED Ring-Lit Party Booth · Celebration Energy',
  },
  {
    id: 'g2',
    imageFile: 'magic-mirror.jpg',
    alt: 'Guest touching illuminated interactive Magic Mirror Photo Booth frame',
    category: 'Photo Booths & Strips',
    caption: 'Magic Mirror Interactive Touchscreen Booth',
  },
  {
    id: 'g3',
    imageFile: 'event-strip-6.jpeg',
    alt: 'Evening outdoor couple engagement moment under palm arch with warm rim lighting',
    category: 'Weddings & Portraits',
    caption: 'Evening Engagement Portrait Under Palms',
  },
  {
    id: 'g4',
    imageFile: 'light-painting.jpg',
    alt: 'Long-exposure Light Painting Photo Booth portrait with pink neon trails',
    category: 'Photo Booths & Strips',
    caption: 'Light Painting Long-Exposure Session',
  },
  {
    id: 'g5',
    imageFile: 'event-hero-1.jpg',
    alt: 'GIA Alumni Collective custom branded 3-pose printed photo strip layout',
    category: 'Celebrations & Corporate',
    caption: 'GIA Alumni Collective · Custom Printed Strip',
  },
  {
    id: 'g6',
    imageFile: 'event-gallery-10.jpg',
    alt: 'High-contrast monochrome architectural hallway portrait',
    category: 'Weddings & Portraits',
    caption: 'Architectural Monochrome Portrait',
  },
  {
    id: 'g7',
    imageFile: 'digital-caricature.jpg',
    alt: 'Live digital caricature illustrator drawing event guests with easel monitor',
    category: 'Photo Booths & Strips',
    caption: 'Live Digital Caricature Artist Station',
  },
  {
    id: 'g8',
    imageFile: 'event-2.jpg',
    alt: 'Delfingen Foundation 10 Years Anniversary corporate photo strip print with fun glasses props',
    category: 'Celebrations & Corporate',
    caption: 'Delfingen Foundation · Branded Corporate Strip',
  },
  {
    id: 'g9',
    imageFile: 'event-4.jpg',
    alt: 'Diwali Milan custom watercolor-framed guest print keepsake',
    category: 'Celebrations & Corporate',
    caption: 'Diwali Milan · Custom Digital Frame Print',
  },
  {
    id: 'g10',
    imageFile: 'event-strip-1.jpeg',
    alt: 'Golden-hour sunset silhouette portrait of couple lifting against warm orange sky',
    category: 'Weddings & Portraits',
    caption: 'Golden Hour Sunset Couple Silhouette',
  },
  {
    id: 'g11',
    imageFile: 'event-gallery-11.jpg',
    alt: 'Four guests posing with tiara, garlands, and funky glasses in studio booth',
    category: 'Photo Booths & Strips',
    caption: 'Studio Backdrop & Prop Session',
  },
  {
    id: 'g12',
    imageFile: 'event-3.jpg',
    alt: 'Group of friends smiling with teddy bear and party props before gold balloons',
    category: 'Celebrations & Corporate',
    caption: 'Balloon Backdrop Group Celebration',
  },
  {
    id: 'g13',
    imageFile: 'selfie-booth.jpeg',
    alt: 'Baby Shower custom 4-pose family photo print template with playful props',
    category: 'Photo Booths & Strips',
    caption: 'Baby Shower · Custom 4-Pose Print Strip',
  },
  {
    id: 'g14',
    imageFile: 'event-strip-3.jpeg',
    alt: 'Live stage celebrity guest appearance captured under blue stage truss lights',
    category: 'Celebrations & Corporate',
    caption: 'Live Stage & Campus Event Coverage',
  },
  {
    id: 'g15',
    imageFile: 'event-gallery-8.jpg',
    alt: 'Children gathered around colourful seventh birthday cake at celebration',
    category: 'Celebrations & Corporate',
    caption: 'Milestone Birthday Celebration Coverage',
  },
  {
    id: 'g16',
    imageFile: 'event-strip-5.jpeg',
    alt: 'Couple sitting under warm sunlit park trees during pre-wedding portrait session',
    category: 'Weddings & Portraits',
    caption: 'Sunlit Garden Couple Session',
  },
  {
    id: 'g17',
    imageFile: 'hashtag-booth.jpg',
    alt: 'Graduation Photo Booth Hashtag prop signs arranged for instant social tagging',
    category: 'Photo Booths & Strips',
    caption: 'Graduation HashTag Booth Prop Kit',
  },
  {
    id: 'g18',
    imageFile: 'event-strip-2.jpeg',
    alt: 'Twilight couple silhouette standing against magenta dusk horizon',
    category: 'Weddings & Portraits',
    caption: 'Twilight Horizon Couple Portrait',
  },
  {
    id: 'g19',
    imageFile: 'event-gallery-12.jpg',
    alt: 'Digital watercolor caricature portrait illustration keepsake of mother and daughter',
    category: 'Photo Booths & Strips',
    caption: 'Custom Watercolor Digital Caricature Output',
  },
  {
    id: 'g20',
    imageFile: 'event-strip-4.jpeg',
    alt: 'Celebrity performer smiling under vibrant concert stage lighting',
    category: 'Celebrations & Corporate',
    caption: 'Evening Concert Stage Coverage',
  },
  {
    id: 'g21',
    imageFile: 'event-gallery-7.jpg',
    alt: 'Natural light outdoor lifestyle portrait framed along tree-lined walkway',
    category: 'Weddings & Portraits',
    caption: 'Outdoor Natural-Light Portrait',
  },
  {
    id: 'g22',
    imageFile: 'event-gallery-5.jpg',
    alt: 'Guest signing ceremonial guestbook beside marigold backdrop garlands',
    category: 'Celebrations & Corporate',
    caption: 'Traditional Ceremony Guestbook Coverage',
  },
  {
    id: 'g23',
    imageFile: 'event-gallery-9.jpg',
    alt: 'Smiling guest beside floral bouquet and traditional marigold drapes',
    category: 'Celebrations & Corporate',
    caption: 'Ceremony Reception Highlights',
  },
];

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    number: '01',
    key: 'keepsakes',
    title: 'Tangible Keepsakes',
    description:
      'Every guest leaves with physical photo strips, custom branded prints, watercolor caricatures, or 3D wax hands alongside instant digital copies.',
  },
  {
    number: '02',
    key: 'interactive',
    title: 'Interactive Experiences',
    description:
      'From touch-interactive Magic Mirrors and neon Light Painting to 360° motion and HashTag prints, booths break the ice across every age group.',
  },
  {
    number: '03',
    key: 'setup',
    title: 'On-Time Setup',
    description:
      'Trained attendants handle transport, studio lighting calibration, prop styling, and smooth teardown across Mumbai, Pune, and Goa.',
  },
  {
    number: '04',
    key: 'packages',
    title: 'Flexible Packages',
    description:
      'Single-booth birthday rentals, multi-day wedding schedules, or custom-branded corporate activations tailored cleanly to your event window.',
  },
];
