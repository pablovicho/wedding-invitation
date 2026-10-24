'use client';

import { useEffect, useState } from 'react';
import { useInvitation } from '@/components/InvitationProvider';
import { themes } from '@/themes';
import { KawungPattern, MelatiStrand, PrianganCorner, PrianganDivider, Siger } from './priangan';
import { DotPattern, TamanCorner, TamanCrest, TamanDivider } from './taman';
import { LangitCluster, LangitCrest, LangitDivider, LangitHanging, StarPattern } from './langit';
import { GadingCorner, GadingCrest, GadingDivider } from './gading';
import { Gunungan, MegaMendungBand } from './jabar';
import { JatiCorner, JatiCrest, JatiDivider } from './jati';
import { SamudraCorner, SamudraCrest, SamudraDivider, WavePattern } from './samudra';
import { LEAF_PATH, MelatiFlower, PETAL_PATH, SPARKLE_PATH } from './shapes';
import type { ThemeName } from '@/config/types';

type Pos = 'tl' | 'tr' | 'bl' | 'br';

const FLIP: Record<Pos, string> = {
  tl: '',
  tr: '-scale-x-100',
  bl: '-scale-y-100',
  br: '-scale-x-100 -scale-y-100',
};
const PLACE: Record<Pos, string> = {
  tl: 'left-0 top-0',
  tr: 'right-0 top-0',
  bl: 'bottom-0 left-0',
  br: 'bottom-0 right-0',
};

type Ornament = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;

// Ornamen per tema. Tema baru cukup didaftarkan di sini.
const SETS: Record<ThemeName, { corner: Ornament; divider: Ornament; crest: Ornament; pattern: (p: { id: string }) => React.ReactElement }> = {
  samudra: { corner: SamudraCorner, divider: SamudraDivider, crest: SamudraCrest, pattern: WavePattern },
  priangan: { corner: PrianganCorner, divider: PrianganDivider, crest: Siger, pattern: KawungPattern },
  taman: { corner: TamanCorner, divider: TamanDivider, crest: TamanCrest, pattern: DotPattern },
  langit: { corner: LangitHanging, divider: LangitDivider, crest: LangitCrest, pattern: StarPattern },
  jati: { corner: JatiCorner, divider: JatiDivider, crest: JatiCrest, pattern: DotPattern },
  gading: { corner: GadingCorner, divider: GadingDivider, crest: GadingCrest, pattern: DotPattern },
};

/** Ornamen sudut; posisikan di dalam elemen `relative` */
export function Corner({ pos, className = 'w-28' }: { pos: Pos; className?: string }) {
  const { theme } = useInvitation();
  const base = `pointer-events-none absolute ${PLACE[pos]} ${className}`;
  if (theme === 'langit') {
    // Ornamen gantung hanya masuk akal di atas; bawah pakai kluster bintang
    const isTop = pos[0] === 't';
    const Comp = isTop ? LangitHanging : LangitCluster;
    const flip = pos[1] === 'r' ? '-scale-x-100' : '';
    return <Comp className={`${base} ${flip}`} />;
  }
  const Comp = SETS[theme].corner;
  return <Comp className={`${base} ${FLIP[pos]}`} />;
}

export function Divider({ className = 'mx-auto w-48' }: { className?: string }) {
  const { theme } = useInvitation();
  const Comp = SETS[theme].divider;
  return <Comp className={`text-accent ${className}`} />;
}

export function Crest({ className = 'mx-auto w-36' }: { className?: string }) {
  const { theme } = useInvitation();
  const Comp = SETS[theme].crest;
  return <Comp className={className} />;
}

/** Gunungan wayang di atas Bismillah (khusus Priangan) */
export function Flourish({ className = 'mx-auto mb-4 w-16' }: { className?: string }) {
  const { theme } = useInvitation();
  return theme === 'priangan' ? <Gunungan className={className} /> : null;
}

/** Pita awan mega mendung di dasar section (khusus Priangan) */
export function CloudBand({ className = '' }: { className?: string }) {
  const { theme } = useInvitation();
  if (theme !== 'priangan') return null;
  return <MegaMendungBand className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`} />;
}

/** Ronce melati di kiri-kanan (khusus Priangan) */
export function SideStrands({ className = '' }: { className?: string }) {
  const { theme } = useInvitation();
  if (theme !== 'priangan') return null;
  return (
    <>
      <MelatiStrand buds={14} className={`pointer-events-none absolute left-3 top-0 w-5 animate-sway ${className}`} style={{ transformOrigin: 'top' }} />
      <MelatiStrand
        buds={10}
        className={`pointer-events-none absolute right-3 top-0 w-5 animate-sway ${className}`}
        style={{ transformOrigin: 'top', animationDelay: '-2s' }}
      />
    </>
  );
}

/** Pola latar halus seluruh halaman */
export function Backdrop() {
  const { theme } = useInvitation();
  const id = `bg-${theme}`;
  const Pattern = SETS[theme].pattern;
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-0 ${theme === 'langit' || theme === 'jati' ? 'grain' : ''}`}>
      {theme === 'langit' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(46_64_110/0.55),transparent_60%),radial-gradient(ellipse_at_bottom,rgb(201_169_110/0.12),transparent_55%)]" />
      )}
      {(theme === 'taman' || theme === 'samudra' || theme === 'jati') && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgb(var(--c-primary)/0.10),transparent_45%),radial-gradient(circle_at_90%_80%,rgb(var(--c-accent)/0.14),transparent_45%)]" />
      )}
      <svg className={`absolute inset-0 h-full w-full ${theme === 'langit' ? 'text-primary/[.05]' : theme === 'gading' ? 'text-accent/[.07]' : 'text-accent/[.09]'}`}>
        <defs>
          <Pattern id={id} />
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

interface Particle {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

/** Animasi partikel sesuai tema. Dibuat di client saja (acak) supaya tidak bentrok saat hydration. */
export function Particles() {
  const { theme } = useInvitation();
  const kind = themes[theme].particle;
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    const count = themes[theme].particleCount;
    const rnd = (min: number, max: number) => min + Math.random() * (max - min);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- posisi acak sengaja hanya di client
    setItems(
      Array.from({ length: count }, () => ({
        left: rnd(0, 100),
        top: rnd(0, 100),
        size: kind === 'sparkle' ? rnd(6, 14) : rnd(12, 22),
        dur: kind === 'sparkle' ? rnd(2.5, 5) : rnd(12, 22),
        delay: -rnd(0, 20),
        drift: rnd(-80, 80),
        spin: rnd(180, 540) * (Math.random() > 0.5 ? 1 : -1),
        opacity: kind === 'sparkle' ? rnd(0.5, 0.95) : rnd(0.45, 0.85),
      })),
    );
  }, [kind, theme]);

  return (
    <div aria-hidden className="particles pointer-events-none fixed inset-0 z-[61] overflow-hidden">
      {theme === 'langit' && <span className="shooting-star" />}
      {items.map((p, i) => {
        const style = {
          left: `${p.left}%`,
          width: p.size,
          height: p.size,
          '--dur': `${p.dur}s`,
          '--delay': `${p.delay}s`,
          '--drift': `${p.drift}px`,
          '--spin': `${p.spin}deg`,
          '--o': p.opacity,
        } as React.CSSProperties;
        if (kind === 'sparkle') {
          return (
            <svg key={i} viewBox="-10 -10 20 20" className={`particle-twinkle ${theme === 'langit' ? 'fill-primary' : 'fill-accent'}`} style={{ ...style, top: `${p.top}%` }}>
              <path d={SPARKLE_PATH} />
            </svg>
          );
        }
        if (kind === 'petal') {
          return (
            <svg key={i} viewBox="-6 -9 12 18" className="particle-fall fill-primary/40" style={style}>
              <path d={PETAL_PATH} />
            </svg>
          );
        }
        if (kind === 'leaf') {
          return (
            <svg key={i} viewBox="-2 -8 21 16" className="particle-fall fill-primary/60" style={style}>
              <path d={LEAF_PATH} />
            </svg>
          );
        }
        return <MelatiFlower key={i} size={p.size} className="particle-fall drop-shadow-sm" style={style} />;
      })}
    </div>
  );
}
