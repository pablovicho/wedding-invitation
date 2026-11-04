'use client';

import { useMemo } from 'react';
import { wedding } from '@/config/wedding.config';
import { useInvitation } from '@/components/InvitationProvider';
import { Corner } from '@/components/ornaments';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { toast } from '@/components/ui/Toast';
import { coupleNames } from '@/lib/couple';
import { dottedDate } from '@/lib/date';
import { checkinPayload, qrPath } from '@/lib/qr';

const MARGIN = 2;

/** Guardar la tarjeta QR como PNG (útil si la señal en el lugar es mala) */
async function downloadCard(svg: SVGSVGElement, guest: string) {
  const css = getComputedStyle(document.documentElement);
  const rgb = (v: string) => `rgb(${css.getPropertyValue(v).trim().split(/\s+/).join(',')})`;
  const W = 720;
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = rgb('--c-surface');
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgb('--c-accent');
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
  await img.decode();
  ctx.fillStyle = '#fff';
  ctx.fillRect(140, 200, 440, 440);
  ctx.drawImage(img, 150, 210, 420, 420);

  const heading = getComputedStyle(document.querySelector('.font-heading') ?? document.body).fontFamily;
  ctx.textAlign = 'center';
  ctx.fillStyle = rgb('--c-muted');
  ctx.font = `500 26px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillText('KARTU TAMU', W / 2, 110);
  ctx.fillStyle = rgb('--c-primary');
  ctx.font = `600 44px ${heading}`;
  ctx.fillText(coupleNames, W / 2, 165);
  ctx.fillStyle = rgb('--c-ink');
  ctx.font = `600 40px ${heading}`;
  ctx.fillText(guest.length > 28 ? guest.slice(0, 27) + '…' : guest, W / 2, 720);
  ctx.fillStyle = rgb('--c-muted');
  ctx.font = `400 24px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillText(dottedDate(wedding.events[0].date), W / 2, 770);
  ctx.fillText('Tunjukkan QR ini kepada penerima tamu', W / 2, 860);

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `QR-${guest.replace(/[^\w]+/g, '-')}.png`;
  a.click();
  toast('Kartu QR disimpan');
}

export default function GuestQR() {
  const { guest } = useInvitation();
  const qr = useMemo(() => (guest ? qrPath(checkinPayload(guest)) : null), [guest]);
  if (!wedding.checkin.enabled || !guest || !qr) return null;
  const box = qr.size + MARGIN * 2;

  return (
    <Section id="qr">
      <SectionTitle eyebrow="Check-in" title="Kartu Tamu">
        Tunjukkan QR ini kepada penerima tamu saat tiba di lokasi untuk check-in lebih cepat.
      </SectionTitle>
      <Reveal className="card mx-auto max-w-xs overflow-hidden px-6 py-8 text-center">
        <Corner pos="tl" className="w-14 opacity-80" />
        <Corner pos="br" className="w-14 opacity-80" />
        <div className="mx-auto w-52 rounded-2xl bg-white p-3 shadow-inner">
          <svg id="guest-qr" viewBox={`0 0 ${box} ${box}`} shapeRendering="crispEdges" className="h-auto w-full" role="img" aria-label={`QR untuk ${guest}`}>
            <rect width={box} height={box} fill="#fff" />
            <path d={qr.d} transform={`translate(${MARGIN} ${MARGIN})`} fill="#111" />
          </svg>
        </div>
        <p className="mt-4 font-heading text-2xl font-semibold leading-tight [overflow-wrap:anywhere]">{guest}</p>
        <button
          onClick={(e) => {
            const svg = (e.currentTarget.parentElement as HTMLElement).querySelector('svg#guest-qr') as SVGSVGElement;
            downloadCard(svg, guest).catch(() => toast('Gagal menyimpan, coba screenshot saja ya'));
          }}
          className="btn-ghost mt-4"
        >
          <Icon name="download" className="h-4 w-4" />
          Simpan Kartu QR
        </button>
      </Reveal>
    </Section>
  );
}
