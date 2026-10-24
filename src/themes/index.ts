import type { ThemeName } from '@/config/types';

export interface ThemeMeta {
  label: string;
  vibe: string;
  /** Warna address bar browser HP */
  themeColor: string;
  particle: 'melati' | 'leaf' | 'sparkle' | 'petal';
  particleCount: number;
  /** Dress code bawaan saat config dressCode.colors = 'theme' */
  dressCode: { note: string; colors: { hex: string; name: string }[] };
}

export const themes: Record<ThemeName, ThemeMeta> = {
  samudra: {
    label: 'Samudra (Biru)',
    vibe: 'Semi-formal — dusty blue, bunga biru & garis ombak',
    themeColor: '#34547A',
    particle: 'petal',
    particleCount: 10,
    dressCode: {
      note: 'Nuansa biru & putih',
      colors: [{ hex: '#F4F7FB', name: 'Putih' }, { hex: '#C9D8EA', name: 'Baby Blue' }, { hex: '#7F9DC2', name: 'Dusty Blue' }, { hex: '#34547A', name: 'Navy' }],
    },
  },
  jati: {
    label: 'Jati (Coklat)',
    vibe: 'Earthy boho — coklat hangat, rumput pampas, pelangi lengkung',
    themeColor: '#7A4E32',
    particle: 'leaf',
    particleCount: 8,
    dressCode: {
      note: 'Earth tone: krem, mocca & coklat',
      colors: [{ hex: '#EADBC8', name: 'Krem' }, { hex: '#B08B6E', name: 'Mocca' }, { hex: '#8A5A3C', name: 'Coklat Susu' }, { hex: '#5C3A24', name: 'Coklat Tua' }],
    },
  },
  gading: {
    label: 'Gading (Krem)',
    vibe: 'Minimalis editorial — krem & taupe, garis art-deco, monogram',
    themeColor: '#F3ECDF',
    particle: 'sparkle',
    particleCount: 10,
    dressCode: {
      note: 'Netral: gading, beige & taupe',
      colors: [{ hex: '#F6F0E4', name: 'Gading' }, { hex: '#E3D5BC', name: 'Beige' }, { hex: '#A8977A', name: 'Taupe' }, { hex: '#6E5E46', name: 'Coklat Abu' }],
    },
  },
  priangan: {
    label: 'Priangan (Marun-Emas)',
    vibe: 'Formal — nuansa Sunda klasik: siger, ronce melati, kawung',
    themeColor: '#6E1C28',
    particle: 'melati',
    particleCount: 10,
    dressCode: {
      note: 'Marun, emas & krem',
      colors: [{ hex: '#F3E6CC', name: 'Krem' }, { hex: '#C9A04E', name: 'Emas' }, { hex: '#6E1C28', name: 'Marun' }, { hex: '#4A2A20', name: 'Coklat' }],
    },
  },
  taman: {
    label: 'Taman (Sage)',
    vibe: 'Semi-formal — sage botanical, lengkung mihrab',
    themeColor: '#5F7050',
    particle: 'leaf',
    particleCount: 10,
    dressCode: {
      note: 'Sage & earthy',
      colors: [{ hex: '#EFEBDD', name: 'Krem' }, { hex: '#BAC4A6', name: 'Sage Muda' }, { hex: '#7D8F68', name: 'Sage' }, { hex: '#4B5A3F', name: 'Olive' }],
    },
  },
  langit: {
    label: 'Langit (Navy Malam)',
    vibe: 'Modern Gen-Z — midnight navy, champagne, bintang & bulan',
    themeColor: '#0D1628',
    particle: 'sparkle',
    particleCount: 22,
    dressCode: {
      note: 'Navy, champagne & silver',
      colors: [{ hex: '#E9D5AA', name: 'Champagne' }, { hex: '#C9CDD6', name: 'Silver' }, { hex: '#1E2C4A', name: 'Navy' }, { hex: '#0D1628', name: 'Midnight' }],
    },
  },
};

export const themeNames = Object.keys(themes) as ThemeName[];
export const isThemeName = (v: unknown): v is ThemeName => typeof v === 'string' && v in themes;
