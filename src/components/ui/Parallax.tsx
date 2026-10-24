'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import { wedding } from '@/config/wedding.config';

/** Isi bergerak sedikit lebih lambat/cepat dari scroll (kesan berlapis). speed negatif = arah berlawanan. */
export default function Parallax({ children, speed = 40, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  return (
    <m.div ref={ref} style={wedding.effects.parallax ? { y } : undefined} className={className}>
      {children}
    </m.div>
  );
}
