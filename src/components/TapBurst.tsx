'use client';

import { useEffect } from 'react';
import { wedding } from '@/config/wedding.config';
import type { ThemeName } from '@/config/types';
import { useInvitation } from './InvitationProvider';
import { LEAF_PATH, PETAL_PATH, SPARKLE_PATH, octagramPoints } from './ornaments/shapes';

const MELATI = [0, 60, 120, 180, 240, 300]
  .map((r) => `<path d="M0-1.2C3-3 3.4-8.6 0-10.6-3.4-8.6-3-3 0-1.2Z" transform="rotate(${r})"/>`)
  .join('');

// SVG mentah (di-inject langsung ke DOM supaya ringan); warna lewat CSS variable tema
const SHAPES: Record<ThemeName, string[]> = {
  samudra: [
    `<svg viewBox="-6 -9 12 18"><path d="${PETAL_PATH}" style="fill:rgb(var(--c-primary)/.55)"/></svg>`,
    `<svg viewBox="-6 -9 12 18"><path d="${PETAL_PATH}" style="fill:rgb(var(--c-accent)/.7)"/></svg>`,
  ],
  jati: [`<svg viewBox="-2 -8 21 16"><path d="${LEAF_PATH}" style="fill:rgb(var(--c-accent)/.8)"/></svg>`],
  gading: [`<svg viewBox="-10 -10 20 20"><path d="${SPARKLE_PATH}" style="fill:rgb(var(--c-accent))"/></svg>`],
  priangan: [
    `<svg viewBox="-12 -12 24 24"><g style="fill:#fffdf7;stroke:rgb(var(--c-accent));stroke-width:.7">${MELATI}</g><circle r="1.7" style="fill:rgb(var(--c-accent))"/></svg>`,
  ],
  taman: [`<svg viewBox="-2 -8 21 16"><path d="${LEAF_PATH}" style="fill:rgb(var(--c-primary)/.7)"/></svg>`],
  langit: [
    `<svg viewBox="-10 -10 20 20"><path d="${SPARKLE_PATH}" style="fill:rgb(var(--c-primary))"/></svg>`,
    `<svg viewBox="-10 -10 20 20"><polygon points="${octagramPoints(9)}" style="fill:rgb(var(--c-primary))"/></svg>`,
  ],
};

/** Semburan kecil ornamen di titik ketukan. Dilewati untuk kolom isian & mode kurangi-gerakan. */
export default function TapBurst() {
  const { theme, opened } = useInvitation();

  useEffect(() => {
    if (!wedding.effects.tapBurst || !opened) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80;overflow:hidden';
    document.body.appendChild(layer);
    const shapes = SHAPES[theme];

    const onTap = (e: PointerEvent) => {
      if ((e.target as Element).closest('input,textarea,select,[contenteditable],.yarl__root')) return;
      const ring = document.createElement('span');
      ring.style.cssText = `position:absolute;left:${e.clientX - 20}px;top:${e.clientY - 20}px;width:40px;height:40px;border-radius:999px;border:1.5px solid rgb(var(--c-accent)/.6)`;
      layer.appendChild(ring);
      ring.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1.6)', opacity: 0 }], { duration: 600, easing: 'ease-out' }).onfinish = () => ring.remove();

      const n = 7;
      for (let i = 0; i < n; i++) {
        const el = document.createElement('span');
        const size = 10 + Math.random() * 10;
        el.innerHTML = shapes[i % shapes.length];
        el.style.cssText = `position:absolute;left:${e.clientX - size / 2}px;top:${e.clientY - size / 2}px;width:${size}px;height:${size}px;display:block`;
        (el.firstElementChild as SVGElement).style.cssText = 'width:100%;height:100%;display:block';
        layer.appendChild(el);
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.6;
        const dist = 40 + Math.random() * 40;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() - 0.5) * 360;
        el.animate(
          [
            { transform: 'translate(0,0) scale(.3) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${rot}deg)`, opacity: 1, offset: 0.6 },
            { transform: `translate(${dx * 1.15}px,${dy + 30}px) scale(.8) rotate(${rot * 1.4}deg)`, opacity: 0 },
          ],
          { duration: 800 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.3,1)' },
        ).onfinish = () => el.remove();
      }
    };

    document.addEventListener('pointerdown', onTap, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onTap);
      layer.remove();
    };
  }, [theme, opened]);

  return null;
}
