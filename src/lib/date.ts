import type { TimeZone, WeddingEvent } from '@/config/types';

const OFFSET: Record<TimeZone, string> = { WIB: '+07:00', WITA: '+08:00', WIT: '+09:00' };
const IANA: Record<TimeZone, string> = { WIB: 'Asia/Jakarta', WITA: 'Asia/Makassar', WIT: 'Asia/Jayapura' };

/**
 * Selalu sertakan offset zona waktu. `new Date('2027-05-15')` dibaca sebagai UTC,
 * sehingga tamu di luar WIB bisa melihat tanggal mundur sehari.
 */
export function toDate(date: string, time: string, tz: TimeZone): Date {
  return new Date(`${date}T${time}:00${OFFSET[tz]}`);
}

export function eventStart(e: WeddingEvent, tz: TimeZone): Date {
  return toDate(e.date, e.start, tz);
}

/** Kalau jam selesai kosong, anggap 2 jam (untuk kalender). */
export function eventEnd(e: WeddingEvent, tz: TimeZone): Date {
  return e.end ? toDate(e.date, e.end, tz) : new Date(eventStart(e, tz).getTime() + 2 * 3600_000);
}

export function formatDate(date: string, tz: TimeZone, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('id-ID', { ...opts, timeZone: IANA[tz] }).format(toDate(date, '12:00', tz));
}

export const longDate = (date: string, tz: TimeZone) =>
  formatDate(date, tz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** "08.00 – 10.00 WIB" atau "11.00 WIB – Selesai" */
export function timeRange(e: WeddingEvent, tz: TimeZone): string {
  const fmt = (t: string) => t.replace(':', '.');
  return e.end ? `${fmt(e.start)} – ${fmt(e.end)} ${tz}` : `${fmt(e.start)} ${tz} – Selesai`;
}

/** Tanggal pendek ala undangan: 15 . 05 . 2027 */
export function dottedDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d} . ${m} . ${y}`;
}
