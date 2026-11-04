'use client';

import { AnimatePresence, LazyMotion, domAnimation, MotionConfig } from 'motion/react';
import { useInvitation } from './InvitationProvider';
import { Backdrop, Particles } from './ornaments';
import BottomNav from './BottomNav';
import MusicPlayer from './MusicPlayer';
import TapBurst from './TapBurst';
import ThemeSwitcher from './ThemeSwitcher';
import Cover from './sections/Cover';
import { Toaster } from './ui/Toast';

/** Portada + elementos flotantes. El contenido de la invitación (children) se sigue renderizando estático detrás de la portada. */
export default function Invitation({ children }: { children: React.ReactNode }) {
  const { opened } = useInvitation();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Backdrop />
        <Particles />
        <AnimatePresence>{!opened && <Cover key="cover" />}</AnimatePresence>
        <div aria-hidden={!opened} inert={!opened}>
          {children}
        </div>
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-700 lg:left-auto lg:w-[30rem] ${
            opened ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}
        >
          <div className="relative mx-auto flex max-w-phone justify-center px-3">
            <div className="pointer-events-auto absolute -top-14 right-3">
              <MusicPlayer />
            </div>
            <div className="pointer-events-auto">
              <BottomNav />
            </div>
          </div>
        </div>
        <TapBurst />
        <ThemeSwitcher />
        <Toaster />
      </MotionConfig>
    </LazyMotion>
  );
}
