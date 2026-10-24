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
    <section id="home" className="screen relative flex flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-16 text-center">
      <Parallax speed={-50} className="pointer-events-none absolute inset-0">
        <Corner pos="tl" />
        <Corner pos="tr" />
      </Parallax>

      <Reveal>
        <p className="eyebrow">The Wedding of</p>
      </Reveal>

      <Reveal delay={0.15} className="relative mx-auto mt-16 w-[68%] max-w-[17rem]">
        <div className="arch absolute -inset-3 border border-accent/60" />
        <div className="arch absolute -inset-1.5 border border-accent/30" />
        <Tilt>
          <div className="arch relative aspect-[3/4] overflow-hidden bg-line/40 shadow-xl">
            <img src={asset(wedding.heroImage)} alt="" className="h-full w-full object-cover" />
          </div>
        </Tilt>
        <Crest className="absolute -top-14 left-1/2 w-32 -translate-x-1/2 drop-shadow" />
      </Reveal>

      <Reveal delay={0.3} className="mt-8">
        <h2 className="font-heading text-5xl font-medium leading-tight">
          <span className="title-accent">{couple[0].nickname}</span>
          <span className="mx-3 font-heading text-4xl italic text-accent">&amp;</span>
          <span className="title-accent">{couple[1].nickname}</span>
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted">{longDate(wedding.events[0].date, wedding.timezone)}</p>
        {wedding.couple.hashtag && (
          <p className="mt-4 inline-block rounded-full border border-primary/30 px-4 py-1 text-xs font-medium text-primary">{wedding.couple.hashtag}</p>
        )}
      </Reveal>

      <a href="#opening" className="absolute bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] left-1/2 -translate-x-1/2 text-muted" aria-label="Gulir ke bawah">
        <svg viewBox="0 0 24 36" className="h-9 w-6 animate-float-y" fill="none" stroke="currentColor" strokeWidth={1.4}>
          <rect x={1} y={1} width={22} height={34} rx={11} />
          <circle cx={12} cy={11} r={2.2} fill="currentColor" />
        </svg>
      </a>
    </section>
  );
}
