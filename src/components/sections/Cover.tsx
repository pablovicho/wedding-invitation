'use client';

import { m, type TargetAndTransition } from 'motion/react';
import { wedding } from '@/config/wedding.config';
import type { ThemeName } from '@/config/types';
import { useState } from 'react';
import { emitGesture, useInvitation } from '@/components/InvitationProvider';
import Envelope from './Envelope';
import { CloudBand, Corner, Crest, SideStrands } from '@/components/ornaments';
import Icon from '@/components/ui/Icon';
import { asset } from '@/lib/asset';
import { couple } from '@/lib/couple';
import { dottedDate } from '@/lib/date';

// Cara cover "dibuka" berbeda per tema: samudra tersingkap ke atas, jati digeser seperti halaman buku
const EXIT: Record<ThemeName, TargetAndTransition> = {
  samudra: { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
  jati: { x: '-100%', rotate: -4, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
  gading: { opacity: 0, scale: 1.03, transition: { duration: 1.1, ease: 'easeInOut' } },
  priangan: { y: '-100%', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } },
  taman: { opacity: 0, scale: 1.08, filter: 'blur(10px)', transition: { duration: 0.9 } },
  langit: { clipPath: 'circle(0% at 50% 82%)', transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } },
};

// Nilai awal clip-path harus sejenis dengan nilai akhirnya supaya bisa dianimasikan
const CLIP_START: Partial<Record<ThemeName, string>> = {
  langit: 'circle(150% at 50% 82%)',
  samudra: 'inset(0% 0% 0% 0%)',
};

export default function Cover() {
  const { guest, open, theme } = useInvitation();
  const { copy } = wedding;
  const [opening, setOpening] = useState(false);

  const start = () => {
    if (opening) return;
    emitGesture(); // harus sinkron di dalam ketukan (musik & sensor gerak iOS)
    if (!wedding.effects.envelope) return open();
    setOpening(true);
    const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(open, quick ? 100 : 1450);
  };

  return (
    <m.div
      className="screen fixed inset-0 z-[60] flex flex-col overflow-hidden bg-bg"
      style={{ clipPath: CLIP_START[theme] }}
      exit={EXIT[theme]}
      role="dialog"
      aria-modal
      aria-label="Sampul undangan"
    >
      <img src={asset(wedding.coverImage)} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/75 to-bg" />
      <Corner pos="tl" className="w-28 sm:w-36" />
      <Corner pos="tr" className="w-28 sm:w-36" />
      <Corner pos="bl" className="w-24 opacity-80" />
      <Corner pos="br" className="w-24 opacity-80" />
      <SideStrands className="h-[38vh] opacity-90" />
      <CloudBand className="opacity-80" />

      <div className="relative z-10 mx-auto flex w-full max-w-phone flex-1 flex-col items-center justify-center px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-16 text-center">
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          {copy.localGreeting && <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-muted">{copy.localGreeting}</p>}
          <p className="text-xs uppercase tracking-[0.3em] text-ink/80">{copy.coverLabel}</p>
          <Crest className="mx-auto mt-4 w-32" />
          <h1 className="mt-2 font-script text-[3.6rem] leading-[1.05] text-primary [text-wrap:balance]">
            {couple[0].nickname}
            <span className="mx-2 font-heading text-4xl text-accent">&amp;</span>
            {couple[1].nickname}
          </h1>
          <p className="mt-3 font-heading text-lg tracking-[0.2em] text-ink/80">{dottedDate(wedding.events[0].date)}</p>
        </m.div>

        <m.div
          className="mt-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {wedding.effects.envelope ? (
            <>
              <Envelope opening={opening} onOpen={start} to={copy.coverTo} guest={guest || 'Tamu Undangan'} />
              <button onClick={start} disabled={opening} className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                {opening ? 'Membuka…' : `Ketuk segel untuk ${copy.coverButton.toLowerCase()}`}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">{copy.coverTo}</p>
              <div className="mx-auto mt-3 min-h-[3.5rem] max-w-xs rounded-2xl border border-line/80 bg-surface/70 px-5 py-3 backdrop-blur-sm">
                <p className="font-heading text-2xl font-semibold leading-tight text-ink [overflow-wrap:anywhere]">{guest || 'Tamu Undangan'}</p>
              </div>
              <button onClick={start} className="btn-primary mt-7 px-7 py-3 text-base">
                <Icon name="mail" />
                {copy.coverButton}
              </button>
            </>
          )}
          <p className="mx-auto mt-3 max-w-xs text-[11px] italic text-muted">{copy.coverNote}</p>
        </m.div>
      </div>
    </m.div>
  );
}
