import type { WeddingEvent, TimeZone } from '@/config/types';
import { eventEnd, eventStart } from './date';

const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeIcs = (s: string) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');

export function googleCalendarUrl(e: WeddingEvent, tz: TimeZone, title: string): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${utcStamp(eventStart(e, tz))}/${utcStamp(eventEnd(e, tz))}`,
    details: e.mapsUrl ? `${e.venue}\n${e.mapsUrl}` : e.venue,
    location: `${e.venue}, ${e.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function downloadIcs(e: WeddingEvent, tz: TimeZone, title: string): void {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.date}-${e.start.replace(':', '')}-${encodeURIComponent(e.title)}@wedding-invitation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(eventStart(e, tz))}`,
    `DTEND:${utcStamp(eventEnd(e, tz))}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(`${e.venue}, ${e.address}`)}`,
    `DESCRIPTION:${escapeIcs(e.mapsUrl ?? e.venue)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${e.title.replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
