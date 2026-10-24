import { wedding } from '@/config/wedding.config';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { asset } from '@/lib/asset';

export default function Story() {
  if (!wedding.story.enabled || wedding.story.items.length === 0) return null;
  return (
    <Section id="story">
      <SectionTitle eyebrow="Our Journey" title="Kisah Kami" />
      <ol className="relative ml-3 border-l border-dashed border-accent/60">
        {wedding.story.items.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.05} className="relative mb-8 pl-7 last:mb-0">
            <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-bg bg-accent ring-4 ring-accent/20" />
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">{s.date}</p>
            <div className="card mt-2 overflow-hidden">
              {s.image && <img src={asset(s.image)} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />}
              <div className="p-5">
                <h3 className="font-heading text-xl font-semibold text-primary">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
