'use client';

import { useEffect, useRef } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = 'cf-turnstile-script';

export const turnstileEnabled = Boolean(SITE_KEY);

interface TurnstileApi {
  render(
    el: HTMLElement,
    opts: {
      sitekey: string;
      theme?: 'auto' | 'light' | 'dark';
      size?: 'normal' | 'compact' | 'flexible';
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    },
  ): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Widget de Cloudflare Turnstile. Si NEXT_PUBLIC_TURNSTILE_SITE_KEY no está definido,
 * no renderiza nada y los formularios no exigen token.
 */
export default function Turnstile({
  onToken,
  size = 'flexible',
}: {
  onToken: (token: string) => void;
  size?: 'normal' | 'compact' | 'flexible';
}) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !container.current) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !container.current) return;
      container.current.innerHTML = '';
      widget.current = window.turnstile.render(container.current, {
        sitekey: SITE_KEY,
        theme: 'auto',
        size,
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render, { once: true });
    }

    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) {
        window.turnstile.remove(widget.current);
        widget.current = null;
      }
    };
  }, [onToken, size]);

  if (!SITE_KEY) return null;

  return <div ref={container} className="flex justify-center" />;
}
