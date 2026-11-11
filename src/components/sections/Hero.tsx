import { wedding } from '@/config/wedding.config';
import { Corner, Crest } from '@/components/ornaments';
import Parallax from '@/components/ui/Parallax';
import Reveal from '@/components/ui/Reveal';
import Tilt from '@/components/ui/Tilt';
import { asset } from '@/lib/asset';
import { couple } from '@/lib/couple';
import { longDate } from '@/lib/date';

export default function Hero() {
  return (
    <section id="home" className="screen relative flex flex-col items-center justify-center overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-16 text-center [@media(max-height:720px)]:pt-12">
      <Parallax speed={-50} className="pointer-events-none absolute inset-0">
        <Corner pos="tl" />
        <Corner pos="tr" />
      </Parallax>

      <Reveal>
        <p className="eyebrow">La boda de</p>
      </Reveal>

      <Reveal delay={0.15} className="hero-photo relative mx-auto mt-16 [@media(max-height:720px)]:mt-14">
        <div className="arch absolute -inset-3 border-4 border-muted/60" />
        <div className="arch absolute -inset-1.5 border border-muted/30" />
        <Tilt>
          <div className="arch relative aspect-[3/4] overflow-hidden bg-line/40 shadow-xl">
            <img src={asset(wedding.heroImage)} alt="" className="h-full w-full object-cover" />
          </div>
        </Tilt>
        <Crest className="absolute -top-14 left-1/2 w-32 -translate-x-1/2 drop-shadow" />
      </Reveal>

      <Reveal delay={0.3} className="mt-8">
        <h2 className="font-heading text-[clamp(2rem,10.5vw,3rem)] font-medium leading-tight [text-wrap:balance]">
          <span className="title-accent">{couple[0].nickname}</span> <span className="font-script text-[1.2em] text-accent">&amp;</span>{' '}
          <span className="title-accent">{couple[1].nickname}</span>
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted">{longDate(wedding.events[0].date, wedding.timezone)}</p>
        {wedding.couple.hashtag && (
          <p className="mt-4 inline-block rounded-full border border-primary/30 px-4 py-1 text-xs font-medium text-primary">{wedding.couple.hashtag}</p>
        )}
      </Reveal>

      {/* Sigue el flujo (no absolute) para que nunca se superponga al hashtag en pantallas de móvil cortas */}
      <a href="#opening" className="mt-6 text-muted [@media(max-height:720px)]:mt-4 -mb-32" aria-label="Gulir ke bawah">
        <svg viewBox="0 0 24 36" className="h-9 w-6 animate-float-y" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x={1} y={1} width={22} height={34} rx={11} />
          <circle cx={12} cy={11} r={2.2} fill="currentColor" />
        </svg>
      </a>
    </section>
  );
}
