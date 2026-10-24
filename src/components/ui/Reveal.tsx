'use client';

import { m, type Variants } from 'motion/react';
import { useInvitation } from '@/components/InvitationProvider';
import type { ThemeName } from '@/config/types';

const EASE = [0.22, 1, 0.36, 1] as const;

// Gaya muncul berbeda per tema: Priangan anggun naik, Taman blur-in lembut, Langit zoom + blur
const VARIANTS: Record<ThemeName, Variants> = {
  samudra: {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
  },
  jati: {
    hidden: { opacity: 0, y: 20, rotate: -1.5 },
    show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9, ease: EASE } },
  },
  gading: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } },
  },
  priangan: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  },
  taman: {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: EASE } },
  },
  langit: {
    hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
  },
};

// Pastikan setiap varian mengatur semua properti yang sama; kalau tema berganti setelah
// halaman dimuat, properti yang tidak disebut (mis. blur) akan tertinggal di elemen.
const RESET = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' };
for (const v of Object.values(VARIANTS)) {
  v.hidden = { ...RESET, ...(v.hidden as object) };
  v.show = { ...RESET, ...(v.show as object) };
}

export default function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li';
}) {
  const { theme } = useInvitation();
  const Comp = as === 'li' ? m.li : m.div;
  return (
    <Comp
      className={className}
      variants={VARIANTS[theme]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </Comp>
  );
}
