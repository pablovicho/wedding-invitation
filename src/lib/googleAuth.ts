const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCRIPT_ID = 'google-identity-script';

export const googleAuthConfigured = Boolean(CLIENT_ID);

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize(opts: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        auto_select?: boolean;
        cancel_on_tap_outside?: boolean;
      }): void;
      renderButton(
        el: HTMLElement,
        opts: { theme?: string; size?: string; text?: string; shape?: string; locale?: string },
      ): void;
      disableAutoSelect(): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

export function loadGoogleIdentity(): Promise<void> {
  if (window.google) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('No se pudo cargar Google Sign-In')), { once: true });
  });
}

export function renderGoogleButton(el: HTMLElement, onCredential: (token: string) => void): void {
  if (!CLIENT_ID || !window.google) throw new Error('Google Sign-In no está configurado');
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => onCredential(response.credential),
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  window.google.accounts.id.renderButton(el, {
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    shape: 'pill',
    locale: 'es',
  });
}

export function decodeGoogleIdToken(token: string): { email?: string; exp?: number; name?: string } {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as { email?: string; exp?: number; name?: string };
  } catch {
    return {};
  }
}
