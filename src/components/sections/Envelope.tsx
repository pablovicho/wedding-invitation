'use client';

import { m } from 'motion/react';
import { couple } from '@/lib/couple';
import { Crest } from '@/components/ornaments';

/** Sello de cera con borde irregular */
function waxPath(r: number, bumps = 14): string {
  const pts = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const rr = r + 1.6 * Math.sin(a * bumps) + 0.8 * Math.sin(a * 5 + 1);
    return `${(32 + rr * Math.cos(a)).toFixed(2)},${(32 + rr * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join('L')}Z`;
}
const WAX = waxPath(28);

function Seal() {
  const initials = `${couple[1].nickname.charAt(0)}${couple[0].nickname.charAt(0)}`.toUpperCase();
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_4px_6px_rgb(0_0_0/0.35)]" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" style={{ stopColor: 'rgb(var(--c-accent))' }} />
          <stop offset="0.55" style={{ stopColor: 'rgb(var(--c-primary))' }} />
          <stop offset="1" style={{ stopColor: 'rgb(var(--c-ink))' }} />
        </radialGradient>
      </defs>
      <path d={WAX} fill="url(#wax)" />
      <circle cx={32} cy={32} r={19} fill="none" className="stroke-on-primary/50" strokeWidth={1.2} />
      <circle cx={32} cy={32} r={16} fill="none" className="stroke-on-primary/25" strokeWidth={0.6} strokeDasharray="1.5 2" />
      <text x={32} y={37.5} textAnchor="middle" fontSize={15} className="fill-on-primary font-heading" letterSpacing={0.5}>
        {initials}
      </text>
    </svg>
  );
}

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Sobre 3D: el invitado toca el sello -> el sello se agrieta, la solapa del sobre gira y se abre,
 * la tarjeta de invitación sube y sale.
 */
export default function Envelope({ opening, onOpen, to, guest }: { opening: boolean; onOpen: () => void; to: string; guest: string }) {
  return (
    <div className="mx-auto w-[min(19rem,84vw)]">
      <div className="relative aspect-[3/2] [perspective:900px]">
        {/* Cuerpo trasero */}
        <div className="absolute inset-0 rounded-xl bg-primary shadow-2xl" />

        {/* Tarjeta de invitación dentro */}
        <m.div
          className="absolute inset-x-[7%] bottom-[6%] top-[6%] z-[1] flex flex-col items-center justify-start rounded-lg bg-surface pt-3 shadow"
          animate={opening ? { y: '-58%' } : { y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        >
          <Crest className="w-16" />
          <p className="mt-1 font-script text-2xl leading-none text-primary">
            {couple[1].nickname} &amp; {couple[0].nickname}
          </p>
          <p className="mt-5 font-script text-2xl leading-none text-shades-400">
            {guest || 'Cómplice'}
          </p>
        </m.div>

        {/* Bolsillo frontal (forma de V) */}
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 z-[2] h-full w-full drop-shadow-[0_-2px_3px_rgb(0_0_0/0.18)]" aria-hidden>
          <path d="M0 6Q0 0 6 0L150 80 294 0Q300 0 300 6V194Q300 200 294 200H6Q0 200 0 194Z" className="fill-primary" />
          <path d="M0 200L136 74M300 200L164 74" className="stroke-on-primary/20" strokeWidth={1} />
        </svg>
        <div className="absolute inset-x-0 bottom-[7%] z-[3] px-6 text-center text-on-primary">
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">{to}</p>
          <p className="mt-0.5 line-clamp-2 font-heading text-xl font-semibold leading-tight [overflow-wrap:anywhere]">{guest}</p>
        </div>

        {/* Solapa del sobre */}
        <m.svg
          viewBox="0 0 300 88"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[44%] w-full origin-top drop-shadow-[0_4px_4px_rgb(0_0_0/0.3)]"
          initial={false}
          animate={opening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
          transition={{ duration: 0.6, ease: EASE, zIndex: { delay: opening ? 0.3 : 0 } }}
          aria-hidden
        >
          <path d="M6 0H294Q300 0 296 4L156 84Q150 88 144 84L4 4Q0 0 6 0Z" className="fill-primary" />
          <path d="M6 0H294Q300 0 296 4L156 84Q150 88 144 84L4 4Q0 0 6 0Z" fill="black" fillOpacity={0.18} />
          <path d="M16 6L150 79 284 6" fill="none" className="stroke-accent/70" strokeWidth={1.2} />
        </m.svg>

        {/* Sello = botón */}
        <m.button
          type="button"
          onClick={onOpen}
          disabled={opening}
          aria-label="Invitación abierta"
          className="absolute left-1/2 top-[44%] z-[5] h-14 w-14 rounded-full"
          // transform lo gestiona motion; el translate de Tailwind será sobrescrito, así que posiciona mediante x/y
          style={{ x: '-50%', y: '-50%' }}
          animate={opening ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], rotate: 25 } : { scale: [1, 1.06, 1] }}
          transition={opening ? { duration: 0.45 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {!opening && <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />}
          <Seal />
        </m.button>
      </div>
    </div>
  );
}
