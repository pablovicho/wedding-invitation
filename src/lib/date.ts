import type { TimeZone, WeddingEvent } from '@/config/types';

const OFFSET: Record<TimeZone, string> = { WIB: '+07:00', WITA: '+08:00', WIT: '+09:00' };
const IANA: Record<TimeZone, string> = { WIB: 'America/Mexico_City', WITA: 'America/Mexico_City', WIT: 'America/Mexico_City' };

/**
 * Incluye siempre el desfase de zona horaria. `new Date('2027-05-15')` se interpreta como UTC,
 * por lo que los invitados fuera de WIB podrían ver la fecha un día antes.
 */
export function toDate(date: string, time: string, tz: TimeZone): Date {
  return new Date(`${date}T${time}:00${OFFSET[tz]}`);
}

export function eventStart(e: WeddingEvent, tz: TimeZone): Date {
  return toDate(e.date, e.start, tz);
}

/** Si la hora de fin está vacía o no es válida, se asumen 6 horas (para el calendario). */
export function eventEnd(e: WeddingEvent, tz: TimeZone): Date {
  const start = eventStart(e, tz);
  const end = e.end ? toDate(e.date, e.end, tz) : null;
  if (end && !Number.isNaN(end.getTime()) && end > start) return end;
  return new Date(start.getTime() + 6 * 3600_000);
}

export function formatDate(date: string, tz: TimeZone, opts: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('es-ES', { ...opts, timeZone: IANA[tz] }).format(toDate(date, '12:00', tz));
}

export const longDate = (date: string, tz: TimeZone) =>
  formatDate(date, tz, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** "08.00 – 10.00 WIB" o "11.00 WIB – Finalizado" */
export function timeRange(e: WeddingEvent, tz: TimeZone): string {
  const fmt = (t: string) => t.replace(':', '.');
  return e.end ? `${fmt(e.start)} – ${fmt(e.end)} ${tz}` : `${fmt(e.start)} ${tz} – Finalizado`;
}

/** Fecha corta al estilo de la invitación: 15 . 05 . 2027 */
export function dottedDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d} . ${m} . ${y}`;
}
