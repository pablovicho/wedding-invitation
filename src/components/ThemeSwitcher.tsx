'use client';

import { useEffect, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { themeNames, themes } from '@/themes';
import { useInvitation } from './InvitationProvider';
import Icon from './ui/Icon';

/**
 * Tombol coba-tema. Tersembunyi untuk tamu: hanya muncul saat `npm run dev`,
 * atau di situs online kalau allowThemePreview: true DAN link berisi ?preview.
 */
export default function ThemeSwitcher() {
  const { theme, setTheme } = useInvitation();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const isPreview = wedding.allowThemePreview && new URLSearchParams(window.location.search).has('preview');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- butuh window, hanya di client
    setVisible(isDev || isPreview);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[65]">
      <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bg shadow-lg" aria-label="Ganti tema">
        <Icon name="palette" />
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-64 space-y-1 rounded-2xl bg-ink p-2 text-bg shadow-2xl">
          {themeNames.map((t) => (
            <li key={t}>
              <button
                onClick={() => setTheme(t)}
                className={`w-full rounded-xl px-3 py-2 text-left ${t === theme ? 'bg-bg/15' : 'hover:bg-bg/10'}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-3 w-3 rounded-full" style={{ background: themes[t].themeColor }} />
                  {themes[t].label}
                </span>
                <span className="block text-[11px] opacity-70">{themes[t].vibe}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
