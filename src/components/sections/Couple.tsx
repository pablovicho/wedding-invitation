import { wedding } from '@/config/wedding.config';
import type { Person } from '@/config/types';
import Icon from '@/components/ui/Icon';
import Parallax from '@/components/ui/Parallax';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { asset } from '@/lib/asset';
import { couple } from '@/lib/couple';

function Profile({ person }: { person: Person }) {
  return (
    <Reveal className="text-center">
      <div className="relative mx-auto w-48">
        <div className="arch absolute -inset-2.5 rotate-[-4deg] border-2 border-accent/50" />
        <div className="arch absolute -inset-2.5 rotate-[4deg] border-2 border-primary/25" />
        <div className="arch relative aspect-[4/5] overflow-hidden bg-line/40 shadow-lg">
          <img src={asset(person.photo)} alt={person.fullName} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      <h3 className="mt-7 font-script text-5xl leading-none text-primary">{person.nickname}</h3>
      <p className="mt-2 font-heading text-xl font-semibold">{person.fullName}</p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace(/^@/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-4 min-h-0 px-4 py-1.5 text-xs"
        >
          <Icon name="instagram" className="h-4 w-4" />@{person.instagram.replace(/^@/, '')}
        </a>
      )}
    </Reveal>
  );
}

export default function Couple() {
  const { copy } = wedding;
  return (
    <Section id="couple" className="text-center">
      <Reveal>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">{copy.opening}</p>
      </Reveal>

      <div className="mt-14 space-y-6">
        <Profile person={couple[0]} />
        <Parallax speed={-24}>
          <p className="font-heading text-6xl italic leading-none text-accent">&amp;</p>
        </Parallax>
        <Profile person={couple[1]} />
      </div>
    </Section>
  );
}
