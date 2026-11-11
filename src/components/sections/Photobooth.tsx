'use client';

import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { Corner, Crest } from '@/components/ornaments';
import { useInvitation } from '@/components/InvitationProvider';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { toast } from '@/components/ui/Toast';
import { coupleNames } from '@/lib/couple';
import { dottedDate } from '@/lib/date';
import { svgToImage } from '@/lib/svgImage';

type Layout = 'story' | 'feed';

const LAYOUTS = {
  story: { w: 1080, h: 1920, arch: { x: 150, y: 470, w: 780, h: 1000 }, script: 250, crest: 290, names: 1610, nameSize: 108, date: 1690, tag: 1770, corner: 360, cornerBottom: 220 },
  feed: { w: 1080, h: 1350, arch: { x: 250, y: 250, w: 580, h: 740 }, script: 150, crest: 0, names: 1110, nameSize: 92, date: 1180, tag: 1240, corner: 300, cornerBottom: 190 },
};

function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

async function compose(photo: HTMLImageElement, layout: Layout, ornaments: HTMLElement): Promise<Blob> {
  const L = LAYOUTS[layout];
  const css = getComputedStyle(document.documentElement);
  const color = (v: string, a = 1) => `rgb(${css.getPropertyValue(v).trim().split(/\s+/).join(',')},${a})`.replace('rgb(', 'rgba(');
  const fontOf = (sel: string) => getComputedStyle(ornaments.querySelector(sel)!).fontFamily;
  const heading = fontOf('.font-heading');
  const script = fontOf('.font-script');
  const body = getComputedStyle(document.body).fontFamily;
  await Promise.all([document.fonts.load(`600 80px ${heading}`), document.fonts.load(`80px ${script}`)]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = L.w;
  canvas.height = L.h;
  const ctx = canvas.getContext('2d')!;

  // Fondo + viñeta suave
  ctx.fillStyle = color('--c-bg');
  ctx.fillRect(0, 0, L.w, L.h);
  const g = ctx.createRadialGradient(L.w / 2, L.h * 0.4, 100, L.w / 2, L.h * 0.4, L.h * 0.8);
  g.addColorStop(0, color('--c-surface', 0.9));
  g.addColorStop(1, color('--c-muted', 0.12));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, L.w, L.h);

  // Foto dentro de marco en arco (object-fit: cover)
  const { x, y, w, h } = L.arch;
  ctx.save();
  archPath(ctx, x, y, w, h);
  ctx.clip();
  const s = Math.max(w / photo.naturalWidth, h / photo.naturalHeight);
  const pw = photo.naturalWidth * s;
  const ph = photo.naturalHeight * s;
  ctx.drawImage(photo, x + (w - pw) / 2, y + (h - ph) / 2, pw, ph);
  ctx.restore();
  ctx.strokeStyle = color('--c-accent', 0.8);
  ctx.lineWidth = 4;
  archPath(ctx, x - 18, y - 18, w + 36, h + 36);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color('--c-accent', 0.4);
  archPath(ctx, x - 32, y - 32, w + 64, h + 64);
  ctx.stroke();

  // Ornamento de esquina (reflejado para el lado derecho); el inferior es más pequeño para no superponerse al texto
  const svgs = ornaments.querySelectorAll('svg');
  const [top, bottom, crest] = await Promise.all([svgToImage(svgs[0], L.corner), svgToImage(svgs[1], L.cornerBottom), svgToImage(svgs[2], 320)]);
  const drawMirrored = (img: HTMLImageElement, yPos: number) => {
    ctx.drawImage(img, 0, yPos, img.width, img.height);
    ctx.save();
    ctx.translate(L.w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, yPos, img.width, img.height);
    ctx.restore();
  };
  drawMirrored(top, 0);
  drawMirrored(bottom, L.h - bottom.height);
  if (L.crest) ctx.drawImage(crest, (L.w - crest.width) / 2, L.crest, crest.width, crest.height);

  // Texto
  ctx.textAlign = 'center';
  ctx.fillStyle = color('--c-accent');
  ctx.font = `64px ${script}`;
  ctx.fillText('La Boda de', L.w / 2, L.script);
  ctx.fillStyle = color('--c-primary');
  ctx.font = `600 ${L.nameSize}px ${heading}`;
  ctx.fillText(coupleNames, L.w / 2, L.names, L.w - 120);
  ctx.fillStyle = color('--c-muted');
  ctx.font = `500 40px ${body}`;
  ctx.fillText(dottedDate(wedding.events[0].date), L.w / 2, L.date);
  const tag = wedding.photobooth.hashtag ?? wedding.couple.hashtag;
  if (tag) {
    ctx.fillStyle = color('--c-primary');
    ctx.font = `600 36px ${body}`;
    ctx.fillText(tag, L.w / 2, L.tag);
  }

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas'))), 'image/jpeg', 0.9));
}

export default function Photobooth() {
  const { theme } = useInvitation();
  const input = useRef<HTMLInputElement>(null);
  const ornaments = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const layout: Layout = 'story';
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!photo || !ornaments.current) return;
    let cancelled = false;
    setBusy(true);
    compose(photo, layout, ornaments.current)
      .then((blob) => {
        if (cancelled) return;
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { blob, url: URL.createObjectURL(blob) };
        });
      })
      .catch((e) => {
        console.error(e);
        toast('Gagal membuat foto, coba foto lain');
      })
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [photo, layout, theme]);

  if (!wedding.photobooth.enabled) return null;

  const pick = (file?: File) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => setPhoto(img);
    img.onerror = () => toast('Format foto tidak didukung');
    img.src = URL.createObjectURL(file);
  };

  const share = async () => {
    if (!result) return;
    const file = new File([result.blob], 'photobooth-invitacion.jpg', { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: coupleNames }).catch(() => {});
    } else {
      download();
    }
  };
  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'photobooth-invitacion.jpg';
    a.click();
  };

  return (
    <Section id="photobooth">
      <SectionTitle eyebrow="Fotografía" title="Nuestra foto contigo">
        Elige o toma una foto, luego se ajustará automáticamente al diseño de la invitación. ¡Listo para compartir!
      </SectionTitle>

      {/* Ornamento fuente para el canvas — no visible */}
      <div ref={ornaments} aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 h-[400px] w-[400px]">
        <div className="relative h-[200px] w-[200px]">
          <Corner pos="tl" className="w-[200px]" />
        </div>
        <div className="relative h-[200px] w-[200px]">
          <Corner pos="bl" className="w-[200px]" />
        </div>
        <Crest className="w-[200px]" />
        <span className="font-heading">.</span>
        <span className="font-script">.</span>
      </div>

      <Reveal className="text-center">
        <div className={`card mx-auto grid w-56 place-items-center overflow-hidden ${layout === 'story' ? 'aspect-[9/16]' : 'aspect-[4/5]'}`}>
          {result ? (
            <img src={result.url} alt="Resultado de la Fotografía" className={`h-full w-full object-cover transition ${busy ? 'opacity-50' : ''}`} />
          ) : (
            <button onClick={() => input.current?.click()} className="flex flex-col items-center gap-2 p-6 text-muted">
              <Icon name="camera" className="h-10 w-10 text-accent" />
              <span className="text-sm">{busy ? 'Procesando...' : 'Haz clic para elegir o tomar una foto'}</span>
            </button>
          )}
        </div>

        <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={() => input.current?.click()} className={result ? 'btn-ghost' : 'btn-primary'}>
            <Icon name="camera" className="h-4 w-4" />
            {result ? 'Cambiar Foto' : 'Elegir / Tomar una Foto'}
          </button>
          {result && (
            <>
              <button onClick={share} className="btn-primary">
                <Icon name="send" className="h-4 w-4" />
                Compartir
              </button>
              <button onClick={download} className="btn-ghost" aria-label="Descargar">
                <Icon name="download" className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
