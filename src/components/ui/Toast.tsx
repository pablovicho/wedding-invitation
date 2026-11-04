'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';

const EVENT = 'invitation:toast';

/** Muestra una notificación breve desde cualquier lugar: toast('¡Copiado!') */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-[70] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <m.div
            key={msg}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg shadow-xl"
          >
            {msg}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
