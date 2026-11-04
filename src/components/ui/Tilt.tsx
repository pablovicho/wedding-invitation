'use client';

import { useEffect, useRef } from 'react';
import { m, useSpring, useTransform } from 'motion/react';
import { wedding } from '@/config/wedding.config';
import { GESTURE_EVENT } from '@/components/InvitationProvider';

const MAX = 9;
const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

// iOS 13+ necesita permiso para el sensor de movimiento, y solo se puede solicitar dentro de un toque
type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

/** Inclinación 3D siguiendo la inclinación del teléfono (giroscopio) o del ratón, más un brillo de luz. */
export default function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 90, damping: 14 });
  const ry = useSpring(0, { stiffness: 90, damping: 14 });
  const glareX = useTransform(ry, [-MAX, MAX], ['-60%', '60%']);

  useEffect(() => {
    if (!wedding.effects.parallax || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let base: number | null = null;

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      base ??= e.beta; // la posición inicial del teléfono se considera "plana"
      rx.set(clamp(-(e.beta - base) / 3));
      ry.set(clamp(e.gamma / 3));
    };
    const onMouse = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      rx.set(clamp(-((e.clientY - (r.top + r.height / 2)) / r.height) * MAX * 2));
      ry.set(clamp(((e.clientX - (r.left + r.width / 2)) / r.width) * MAX * 2));
    };
    const onGesture = () => {
      const DOE = window.DeviceOrientationEvent as IOSOrientation | undefined;
      DOE?.requestPermission?.().catch(() => {});
    };

    window.addEventListener('deviceorientation', onOrient);
    window.addEventListener('pointermove', onMouse);
    window.addEventListener(GESTURE_EVENT, onGesture);
    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      window.removeEventListener('pointermove', onMouse);
      window.removeEventListener(GESTURE_EVENT, onGesture);
    };
  }, [rx, ry]);

  return (
    <div className={`[perspective:900px] ${className}`}>
      <m.div ref={ref} style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative">
        {children}
        <m.div
          aria-hidden
          className="arch pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
          style={{ opacity: wedding.effects.parallax ? 1 : 0 }}
        >
          <m.div className="absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.55)_50%,transparent_65%)]" style={{ x: glareX }} />
        </m.div>
      </m.div>
    </div>
  );
}
