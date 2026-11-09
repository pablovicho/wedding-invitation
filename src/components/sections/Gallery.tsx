'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { wedding } from '@/config/wedding.config';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { asset } from '@/lib/asset';

// El lightbox solo se descarga cuando se toca la foto por primera vez
const Lightbox = dynamic(() => import('./GalleryLightbox'), { ssr: false });

function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const { photos, youtube, enabled } = wedding.gallery;
  if (!enabled || photos.length === 0) return null;
  const yt = youtubeId(youtube);

  return (
    <Section id="gallery">
      <SectionTitle eyebrow="" title="Nosotros" />

      {yt && (
        <Reveal className="card mb-4 aspect-video overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            title="Video"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </Reveal>
      )}

      <div className="columns-2 gap-2.5 [column-fill:_balance]">
        {photos.map((p, i) => (
          <Reveal key={p.src} delay={(i % 4) * 0.05} className="mb-2.5 break-inside-avoid">
            <button
              onClick={() => setIndex(i)}
              className="group block w-full overflow-hidden rounded-2xl bg-line/40 shadow-sm"
              aria-label={`Lihat ${p.alt}`}
            >
              <img
                src={asset(p.src)}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="w-full transition duration-700 group-hover:scale-105 group-active:scale-[1.02]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {index >= 0 && <Lightbox index={index} onClose={() => setIndex(-1)} slides={photos.map((p) => ({ src: asset(p.src), alt: p.alt }))} />}
    </Section>
  );
}
