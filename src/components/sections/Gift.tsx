'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { wedding } from '@/config/wedding.config';
import type { GiftAccount } from '@/config/types';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { toast } from '@/components/ui/Toast';
import { asset } from '@/lib/asset';
import { copyText } from '@/lib/clipboard';

async function copy(text: string, label: string) {
  const ok = await copyText(text);
  toast(ok ? `${label} copiado ✓` : 'Fallo al copiar, copia manualmente');
}

const CARD_BG = 'bg-gradient-to-br from-primary via-primary/90 to-accent text-on-primary';
const FAN = [
  { rotate: -7, x: -18 },
  { rotate: 5, x: 16 },
  { rotate: -1, x: 0 },
];

/**
 * Vista cerrada: pila de tarjetas que "asoman" desde la cartera y se balancean suavemente,
 * para que el invitado sepa que esta sección se puede abrir sin que los números de cuenta queden a la vista.
 */
function GiftPeek({ onOpen }: { onOpen: () => void }) {
  const { accounts } = wedding.gift;
  const cards = accounts.slice(0, 3);
  return (
    <button type="button" onClick={onOpen} aria-expanded={false} className="group relative mx-auto block h-52 w-full max-w-[19rem] text-left">
      {cards.map((acc, i) => {
        const f = FAN[(FAN.length - cards.length + i) % FAN.length];
        return (
          <m.div
            key={`${acc.provider}-${acc.number}`}
            className={`absolute inset-x-5 top-2 h-36 rounded-3xl p-4 shadow-xl ${CARD_BG}`}
            style={{ x: f.x }}
            animate={{ rotate: [f.rotate, f.rotate + (i % 2 ? -2 : 2), f.rotate], y: [0, -6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <span className="h-5 w-7 rounded bg-gradient-to-br from-yellow-100 to-yellow-500/80" aria-hidden />
              <span className="font-heading text-base font-bold italic">{acc.provider}</span>
            </div>
            <p className="mt-3 font-mono text-sm tracking-[0.2em] opacity-90">•••• {acc.number.replace(/\s/g, '').slice(-4)}</p>
          </m.div>
        );
      })}

      {/* Bolsillo/cartera */}
      <div className="card absolute inset-x-0 bottom-0 z-10 flex h-28 flex-col items-center justify-center gap-1 transition group-active:scale-[0.98]">
        <span className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Icon name="gift" className="h-4 w-4" />
          Envía un regalo
        </span>
        <span className="text-xs text-muted">Haz clic para ver los detalles</span>
        <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 animate-bounce text-accent" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}

const list = { show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 24, rotate: -2 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Tarjeta estilo tarjeta ATM/e-wallet */
function AccountCard({ acc }: { acc: GiftAccount }) {
  const number = acc.number.replace(/\s/g, '');
  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 shadow-xl ${CARD_BG}`}>
      <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-white/5" />
      <div className="relative flex items-start justify-between">
        {acc.type === 'bank' ? (
          <span className="h-7 w-10 rounded-md bg-gradient-to-br from-yellow-100 to-yellow-500/80 shadow-inner" aria-hidden />
        ) : (
          <span className="text-[11px] uppercase tracking-widest opacity-80">E-Wallet</span>
        )}
        {acc.logo ? (
          <img src={asset(acc.logo)} alt={acc.provider} className="h-8 max-w-[6rem] rounded bg-white/90 object-contain px-1.5 py-0.5" />
        ) : (
          <span className="font-heading text-xl font-bold italic">{acc.provider}</span>
        )}
      </div>
      <p className="relative mt-6 font-mono text-xl tracking-[0.12em] [overflow-wrap:anywhere]">{number.replace(/(.{4})(?=.)/g, '$1 ')}</p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest opacity-70">a.n.</p>
          <p className="truncate text-sm font-semibold">{acc.holder}</p>
        </div>
        <button onClick={() => copy(number, 'Número')} className="btn min-h-[40px] shrink-0 bg-white/20 px-4 py-2 text-xs text-on-primary backdrop-blur">
          <Icon name="copy" className="h-4 w-4" />
          Copiar
        </button>
      </div>
    </div>
  );
}

export default function Gift() {
  const { gift } = wedding;
  const [open, setOpen] = useState(!gift.collapsed);
  if (!gift.enabled) return null;

  return (
    <Section id="gift">
      <SectionTitle eyebrow="Regalo" title="Gracias por tu regalo">
        Tu agradecimiento es muy importante para nosotros. Pero si deseas hacer un regalo, puedes hacerlo a través de:
      </SectionTitle>

      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <m.div key="peek" exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}>
            <Reveal>
              <GiftPeek onOpen={() => setOpen(true)} />
            </Reveal>
          </m.div>
        ) : (
          <m.div key="open" variants={list} initial="hidden" animate="show" className="space-y-4">
            {gift.accounts.map((acc) => (
              <m.div key={`${acc.provider}-${acc.number}`} variants={item}>
                <AccountCard acc={acc} />
              </m.div>
            ))}

            {gift.address && (
              <m.div variants={item} className="card p-5 text-center">
                <Icon name="gift" className="mx-auto h-7 w-7 text-accent" />
                <p className="mt-2 font-heading text-lg font-semibold">Mesa de regalos</p>
                <p className="mt-1 text-sm font-medium">{gift.address.recipient}</p>
                {gift.address.phone && <p className="text-sm text-muted">{gift.address.phone}</p>}
                <p className="mt-1 text-sm leading-relaxed text-muted">{gift.address.address}</p>
                <button
                  onClick={() => copy([gift.address!.recipient, gift.address!.phone, gift.address!.address].filter(Boolean).join('\n'), 'Dirección')}
                  className="btn-ghost mt-4"
                >
                  <Icon name="copy" className="h-4 w-4" />
                  Copiar Dirección
                </button>
              </m.div>
            )}

            {gift.collapsed && (
              <m.div variants={item} className="text-center">
                <button onClick={() => setOpen(false)} className="text-sm font-medium text-muted underline underline-offset-4">
                  Ocultar
                </button>
              </m.div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
