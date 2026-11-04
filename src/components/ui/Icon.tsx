// Iconos de línea sencillos (24x24, stroke currentColor) para no necesitar una librería de iconos.
const PATHS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  heart: 'M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7S10.5 3 8 4s0 3 4 3zm0 0s1.5-4 4-3 0 3-4 3z',
  chat: 'M4 5h16v11H8l-4 4z',
  rsvp: 'M9 3h6v3H9zM7 4.5H5V21h14V4.5h-2M9 13.5l2 2 4-4.5',
  pin: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2',
  check: 'M5 12.5 10 17 19 7',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5h3v14H8zM13 5h3v14h-3z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  send: 'M4 12 20 4l-6 16-3-7z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  video: 'M3 6h12v12H3zM15 10l6-3v10l-6-3z',
  whatsapp: 'M4 20l1.3-3.9A8 8 0 1 1 8 19zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a5 5 0 0 1-2.7-2.7l.8-1-1-2z',
  sparkle: 'M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z',
  palette: 'M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.2-1.6-.4-1 .3-2.4 1.6-2.4H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10zM7.5 12h.01M9.5 7.5h.01M14.5 7.5h.01',
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}
