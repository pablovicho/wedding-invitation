import type { Metadata, Viewport } from 'next';
import {
  Allura,
  Amiri,
  Bodoni_Moda,
  Cormorant_Garamond,
  Fraunces,
  Great_Vibes,
  Instrument_Serif,
  Pinyon_Script,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import { wedding } from '@/config/wedding.config';
import { themes } from '@/themes';
import { asset } from '@/lib/asset';
import { coupleNames } from '@/lib/couple';
import { longDate } from '@/lib/date';
import './globals.css';

// Font body di-preload; font tema hanya diunduh browser kalau dipakai tema aktif.
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-cormorant', display: 'swap', preload: false });
const pinyon = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-pinyon', display: 'swap', preload: false });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap', preload: false });
const allura = Allura({ subsets: ['latin'], weight: '400', variable: '--font-allura', display: 'swap', preload: false });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap', preload: false });
const greatVibes = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-greatvibes', display: 'swap', preload: false });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', preload: false });
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap', preload: false });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic', display: 'swap', preload: false });

const fonts = [jakarta, cormorant, pinyon, playfair, allura, instrument, greatVibes, fraunces, bodoni, amiri].map((f) => f.variable).join(' ');

// SITE_URL diisi otomatis oleh workflow GitHub Pages; selain itu pakai wedding.site.url
const siteUrl = process.env.SITE_URL || wedding.site.url;
const title = `The Wedding of ${coupleNames}`;
const description = `${longDate(wedding.events[0].date, wedding.timezone)} — ${wedding.site.description}`;

export const metadata: Metadata = {
  // Hanya origin: path gambar OG sudah membawa basePath lewat asset()
  metadataBase: siteUrl ? new URL(new URL(siteUrl).origin) : undefined,
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'id_ID',
    images: [{ url: asset(wedding.site.ogImage), width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: wedding.site.indexable ? undefined : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: themes[wedding.theme].themeColor,
};

// Tema hanya bisa diganti lewat URL saat dev atau kalau allowThemePreview: true
const themePreview = process.env.NODE_ENV === 'development' || wedding.allowThemePreview;

// Terapkan ?theme= sebelum halaman tampil supaya tidak berkedip saat preview tema
const themeScript = `try{var t=new URLSearchParams(location.search).get('theme');if(${JSON.stringify(Object.keys(themes))}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme={wedding.theme} className={fonts} suppressHydrationWarning>
      <head>{themePreview && <script dangerouslySetInnerHTML={{ __html: themeScript }} />}</head>
      <body>{children}</body>
    </html>
  );
}
