import { wedding } from '@/config/wedding.config';
import { Corner } from '@/components/ornaments';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { formatDate, timeRange } from '@/lib/date';
import Countdown from './Countdown';
import DressCode from './DressCode';

export default function Events() {
  const { events, timezone: tz, dressCode } = wedding;
  return (
    <Section id="event">
      <SectionTitle eyebrow="Aparta la fecha" title="Marce y Pablo" />

      <Reveal>
        <Countdown />
      </Reveal>

      <div className="mt-10 space-y-6">
        {events.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.1} className="card overflow-hidden px-6 py-10 text-center">
            <Corner pos="tl" className="w-20 opacity-90" />
            <Corner pos="br" className="w-20 opacity-90" />
            <h3 className="font-script text-5xl leading-none text-primary">{e.title}</h3>

            <div className="mx-auto mt-6 flex max-w-[16rem] items-center justify-center gap-4">
              <span className="flex-1 border-y border-accent/50 py-1.5 text-sm font-medium uppercase tracking-widest">
                {formatDate(e.date, tz, { weekday: 'long' })}
              </span>
              <span className="font-heading text-5xl font-semibold leading-none text-accent">{formatDate(e.date, tz, { day: 'numeric' })}</span>
              <span className="flex-1 border-y border-accent/50 py-1.5 text-sm font-medium uppercase tracking-widest">
                {formatDate(e.date, tz, { month: 'short' })} {formatDate(e.date, tz, { year: 'numeric' })}
              </span>
            </div>

            <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
              <Icon name="clock" className="h-4 w-4 text-accent" />
              {timeRange(e, tz)}
            </p>

            <div className="mt-5">
              <p className="font-heading text-xl font-semibold">{e.venue}</p>
              <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-muted">{e.address}</p>
              {e.note && <p className="mt-3 text-xs italic text-muted">* {e.note}</p>}
            </div>

            {e.dressCode && (
              <div className="mt-5 border-t border-line/60 pt-4">
                <DressCode value={e.dressCode} compact />
              </div>
            )}

            {e.mapsUrl && (
              <a href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
                <Icon name="pin" className="h-4 w-4" />
                Google Maps
              </a>
            )}
          </Reveal>
        ))}
      </div>

      {dressCode && (
        <Reveal className="mt-8">
          <DressCode value={dressCode} />
        </Reveal>
      )}
    </Section>
  );
}
