import { wedding } from '@/config/wedding.config';
import { CloudBand, Corner, Crest } from '@/components/ornaments';
import Parallax from '@/components/ui/Parallax';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { asset } from '@/lib/asset';
import { couple } from '@/lib/couple';

export default function Closing() {
  const { copy } = wedding;
  return (
    <Section id="closing" className="pb-36 text-center">
      <CloudBand className="opacity-90" />
      <Parallax speed={30} className="pointer-events-none absolute inset-0">
        <Corner pos="bl" />
        <Corner pos="br" />
      </Parallax>

      <Reveal className="relative mx-auto w-56">
        <div className="arch aspect-[3/4] overflow-hidden shadow-xl">
          <img src={asset(wedding.coverImage)} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">{copy.closing}</p>
        <p lang="ar" dir="rtl" className="mt-6 font-arabic text-xl leading-loose text-primary">
          بَارَكَ اللّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ
        </p>
        <p className="mx-auto mt-1 max-w-xs text-xs italic text-muted">
          &ldquo;Semoga Allah memberkahi kalian berdua dan mengumpulkan kalian dalam kebaikan.&rdquo;
        </p>
        {copy.localThanks && <p className="mt-1 font-script text-3xl text-accent">{copy.localThanks}</p>}
      </Reveal>

      <Reveal className="mt-10">
        <Crest className="mx-auto mt-8 w-28" />
        <p className="mt-2 font-script text-5xl text-primary">
          {couple[0].nickname} <span className="font-heading text-4xl italic text-accent">&amp;</span> {couple[1].nickname}
        </p>
      </Reveal>
    </Section>
  );
}
