import { wedding } from '@/config/wedding.config';
import { Corner, Divider, Flourish } from '@/components/ornaments';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';

export default function Opening() {
  const { quote } = wedding;
  return (
    <Section id="opening" className="text-center">
      <Reveal>
        <Flourish />
        <p lang="ar" dir="rtl" className="font-arabic text-3xl leading-loose text-primary">
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
      </Reveal>

      <Reveal delay={0.1} className="card mt-8 px-6 pb-8 pt-10">
        <Corner pos="tl" className="w-16 opacity-80" />
        <Corner pos="br" className="w-16 opacity-80" />
        <p lang="ar" dir="rtl" className="font-arabic text-xl leading-[2.3] text-ink">
          {quote.arabic}
        </p>
        <Divider className="mx-auto my-5 w-32" />
        <p className="text-sm italic leading-relaxed text-muted">&ldquo;{quote.translation}&rdquo;</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{quote.source}</p>
      </Reveal>
    </Section>
  );
}
