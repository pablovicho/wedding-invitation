import { wedding } from '@/config/wedding.config';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';

export default function LiveStream() {
  const { liveStream } = wedding;
  if (!liveStream.enabled) return null;
  return (
    <Section id="live">
      <SectionTitle eyebrow="Live Streaming" title="Saksikan Secara Virtual">
        Bagi yang berhalangan hadir, acara dapat disaksikan secara langsung melalui {liveStream.platform}.
      </SectionTitle>
      <Reveal className="text-center">
        <a href={liveStream.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <Icon name="video" className="h-4 w-4" />
          Tonton di {liveStream.platform}
        </a>
      </Reveal>
    </Section>
  );
}
