'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import type { ThemeName } from '@/config/types';
import { isThemeName, themes } from '@/themes';

interface InvitationState {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  /** Nama tamu dari link ?to=Nama */
  guest: string;
  opened: boolean;
  open: () => void;
}

/**
 * Dikirim SINKRON saat tamu mengetuk "buka". iOS hanya mengizinkan musik & sensor gerak
 * dimulai di dalam ketukan, bukan setelah animasi selesai.
 */
export const GESTURE_EVENT = 'invitation:gesture';
export const emitGesture = () => window.dispatchEvent(new Event(GESTURE_EVENT));

/** Ganti tema lewat URL hanya untuk dev / mode preview. Tamu selalu melihat tema dari config. */
export const themePreviewAllowed = () => process.env.NODE_ENV === 'development' || wedding.allowThemePreview;

const Ctx = createContext<InvitationState | null>(null);

export function InvitationProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(wedding.theme);
  const [guest, setGuest] = useState('');
  const [opened, setOpened] = useState(false);

  // Baca query string di client (static export tidak punya server untuk itu)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to')?.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- query string hanya ada di client
    if (to) setGuest(to.slice(0, 80));
    const t = params.get('theme');
    if (themePreviewAllowed() && isThemeName(t)) setThemeState(t);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themes[theme].themeColor);
  }, [theme]);

  // Kunci scroll selama cover masih tampil
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !opened);
  }, [opened]);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    const url = new URL(window.location.href);
    url.searchParams.set('theme', t);
    window.history.replaceState(null, '', url);
  }, []);

  const open = useCallback(() => {
    window.scrollTo(0, 0);
    setOpened(true);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, guest, opened, open }), [theme, setTheme, guest, opened, open]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInvitation(): InvitationState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useInvitation harus dipakai di dalam <InvitationProvider>');
  return ctx;
}
