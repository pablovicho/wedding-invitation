import { wedding } from '@/config/wedding.config';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Playlist() {
  const { playlist } = wedding;
  if (!playlist.enabled) return null;
  return (
    <Section id="playlist">
      <SectionTitle eyebrow="Playlist" title="Agrega tu música">
        Si gustas, puedes agregar tu música favorita para nuestra boda en {playlist.platform}.
      </SectionTitle>
      <Reveal className="text-center">
        <a href={playlist.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <Icon name="video" className="h-4 w-4" />
          Ver en {playlist.platform}
        </a>
      </Reveal>
    </Section>
  );
}
