'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { decodeGoogleIdToken, googleAuthConfigured, loadGoogleIdentity, renderGoogleButton } from '@/lib/googleAuth';

const TOKEN_KEY = 'admin-google-id-token';

interface AdminAuthState {
  idToken: string | null;
}

const Ctx = createContext<AdminAuthState>({ idToken: null });

export function useAdminToken(): string | null {
  return useContext(Ctx).idToken;
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const button = useRef<HTMLDivElement>(null);

  const acceptCredential = useCallback((credential: string) => {
    try {
      sessionStorage.setItem(TOKEN_KEY, credential);
    } catch {}
    setToken(credential);
  }, []);

  useEffect(() => {
    if (!googleAuthConfigured) return;

    try {
      const saved = sessionStorage.getItem(TOKEN_KEY);
      const exp = saved ? decodeGoogleIdToken(saved).exp : undefined;
      if (saved && exp && exp * 1000 > Date.now()) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sesión recuperada de sessionStorage
        setToken(saved);
        return;
      }
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {}

    loadGoogleIdentity()
      .then(() => {
        if (button.current) renderGoogleButton(button.current, acceptCredential);
      })
      .catch(() => setError('No se pudo cargar Google Sign-In. Revisa tu conexión.'));
  }, [acceptCredential]);

  useEffect(() => {
    if (!token) return;
    const exp = decodeGoogleIdToken(token).exp;
    if (!exp) return;
    const ms = exp * 1000 - Date.now();
    const timer = setTimeout(() => {
      try {
        sessionStorage.removeItem(TOKEN_KEY);
      } catch {}
      setToken(null);
    }, Math.max(0, ms));
    return () => clearTimeout(timer);
  }, [token]);

  if (!googleAuthConfigured) {
    return <Ctx.Provider value={{ idToken: null }}>{children}</Ctx.Provider>;
  }

  if (token) {
    return <Ctx.Provider value={{ idToken: token }}>{children}</Ctx.Provider>;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-3xl font-semibold text-primary">Acceso restringido</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Inicia sesión con una cuenta de Google autorizada para abrir esta página.
      </p>
      <div ref={button} className="mt-6" />
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </main>
  );
}
