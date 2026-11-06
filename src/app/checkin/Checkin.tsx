'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminToken } from '@/components/AdminGate';
import Icon from '@/components/ui/Icon';
import { coupleNames } from '@/lib/couple';
import { parseCheckin } from '@/lib/qr';
import { sheetsConfigured, sheetsPost } from '@/lib/sheets';

interface Entry {
  name: string;
  at: string;
  /** false = aún no ingresado en Google Sheets, se reenviará automáticamente */
  synced: boolean;
  staff?: string;
}

/** Se guarda en el localStorage del navegador del teléfono del personal (por dispositivo y por dominio). */

const STORE = 'checkin-log';

// BarcodeDetector aún no existe en todos los tipos de TS / navegadores (iOS Safari todavía no lo soporta)
interface Detector {
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}
declare global {
  interface Window {
    BarcodeDetector?: new (opts: { formats: string[] }) => Detector;
  }
}

function load(): Entry[] {
  try {
    return JSON.parse(localStorage.getItem(STORE) ?? '[]');
  } catch {
    return [];
  }
}

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    o.frequency.value = 880;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.12);
  } catch {}
}

export default function Checkin() {
  const idToken = useAdminToken();
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const lastScan = useRef({ text: '', at: 0 });
  const [scanning, setScanning] = useState(false);
  const [log, setLog] = useState<Entry[]>([]);
  const [flash, setFlash] = useState<{ name: string; dup: boolean } | null>(null);
  const [manual, setManual] = useState('');
  const [staff, setStaff] = useState('');
  const [error, setError] = useState('');

  // Reenviar los check-in que aún no llegaron a Sheets (p. ej. señal cortada en el edificio)
  const syncPending = useCallback(async () => {
    if (!sheetsConfigured || !navigator.onLine) return;
    for (const e of load().filter((x) => !x.synced)) {
      try {
        await sheetsPost('checkin', { name: e.name, staff: e.staff ?? '', adminToken: idToken ?? undefined });
        const updated = load().map((x) => (x.at === e.at ? { ...x, synced: true } : x));
        localStorage.setItem(STORE, JSON.stringify(updated));
        setLog(updated);
      } catch {
        return; // todavía sin conexión, reintentar más tarde
      }
    }
  }, [idToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState ocurre después de que finaliza la solicitud asíncrona
    syncPending();
    window.addEventListener('online', syncPending);
    const id = setInterval(syncPending, 30_000);
    return () => {
      window.removeEventListener('online', syncPending);
      clearInterval(id);
    };
  }, [syncPending]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setLog(load());
    try {
      setStaff(localStorage.getItem('checkin-staff') ?? '');
    } catch {}
  }, []);

  const record = useCallback(
    (name: string) => {
      const current = load();
      const dup = current.some((e) => e.name.toLowerCase() === name.toLowerCase());
      setFlash({ name, dup });
      navigator.vibrate?.(dup ? [80, 60, 80] : 120);
      beep();
      setTimeout(() => setFlash(null), 2500);
      if (dup) return;
      const entry: Entry = { name, at: new Date().toISOString(), synced: !sheetsConfigured, staff };
      const next = [entry, ...current];
      localStorage.setItem(STORE, JSON.stringify(next));
      setLog(next);
      if (sheetsConfigured) {
        sheetsPost('checkin', { name, staff, adminToken: idToken ?? undefined })
          .then(() => {
            const updated = load().map((e) => (e.at === entry.at ? { ...e, synced: true } : e));
            localStorage.setItem(STORE, JSON.stringify(updated));
            setLog(updated);
          })
          .catch(console.error); // reenviado por syncPending
      }
    },
    [staff, idToken],
  );

  const stop = useCallback(() => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setScanning(false);
  }, []);

  const start = async () => {
    setError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      stream.current = s;
      setScanning(true);
    } catch {
      setError('No se puede abrir la cámara. Asegúrate de que el sitio esté abierto a través de https y que se le dé permiso a la cámara.');
    }
  };

  // Bucle de escaneo: BarcodeDetector (Android/Chrome) o jsQR (iPhone y otros)
  useEffect(() => {
    if (!scanning || !video.current || !stream.current) return;
    const v = video.current;
    v.srcObject = stream.current;
    v.play().catch(() => {});
    let raf = 0;
    let alive = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const detector = window.BarcodeDetector ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
    const jsqr = detector ? null : import('jsqr').then((m) => m.default);

    const tick = async () => {
      if (!alive) return;
      if (v.readyState >= 2) {
        let text: string | null = null;
        if (detector) {
          const codes = await detector.detect(v).catch(() => []);
          text = codes[0]?.rawValue ?? null;
        } else {
          const w = 480;
          const h = Math.round((v.videoHeight / v.videoWidth) * w) || 480;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(v, 0, 0, w, h);
          const decode = await jsqr!;
          text = decode(ctx.getImageData(0, 0, w, h).data, w, h)?.data ?? null;
        }
        const now = Date.now();
        if (text && (text !== lastScan.current.text || now - lastScan.current.at > 4000)) {
          lastScan.current = { text, at: now };
          const name = parseCheckin(text);
          if (name) record(name);
          else {
            setError('El código QR no es de esta invitación');
            setTimeout(() => setError(''), 2000);
          }
        }
      }
      raf = requestAnimationFrame(() => setTimeout(tick, 150));
    };
    tick();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [scanning, record]);

  useEffect(() => stop, [stop]);

  const exportCsv = () => {
    const rows = [['Hora', 'Nombre'], ...log.map((e) => [new Date(e.at).toLocaleString('es-ES'), e.name])];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    a.download = 'checkin-tamu.csv';
    a.click();
  };

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-16 pt-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Check-in de Visitantes</p>
      <h1 className="font-heading text-3xl font-semibold text-primary">{coupleNames}</h1>
      <p className="mt-1 text-sm text-muted">
        {sheetsConfigured ? 'Guardado en este teléfono y Google Sheets.' : 'Guardado en este teléfono (activa Google Sheets para sincronizar entre teléfonos).'}
      </p>

      <label className="mt-5 block text-sm font-medium">
        Nombre del personal (opcional)
        <input
          className="field mt-1"
          value={staff}
          onChange={(e) => {
            setStaff(e.target.value);
            try {
              localStorage.setItem('checkin-staff', e.target.value);
            } catch {}
          }}
        />
      </label>

      <div className="card relative mt-5 aspect-square overflow-hidden bg-black">
        {scanning ? (
          <>
            <video ref={video} playsInline muted className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-[18%] rounded-3xl border-4 border-white/80 shadow-[0_0_0_999px_rgb(0_0_0/0.35)]" />
          </>
        ) : (
          <button onClick={start} className="flex h-full w-full flex-col items-center justify-center gap-3 text-white">
            <Icon name="camera" className="h-12 w-12" />
            <span className="font-semibold">Iniciar Escaneo de Código QR</span>
          </button>
        )}
        {flash && (
          <div className={`absolute inset-x-3 bottom-3 rounded-2xl p-4 text-center text-white shadow-xl ${flash.dup ? 'bg-amber-600' : 'bg-emerald-600'}`}>
            <p className="text-xs uppercase tracking-widest opacity-90">{flash.dup ? 'Ya se ha registrado anteriormente' : 'Bienvenido/a'}</p>
            <p className="text-xl font-bold">{flash.name}</p>
          </div>
        )}
      </div>
      {scanning && (
        <button onClick={stop} className="btn-ghost mt-3 w-full">
          Detener Cámara
        </button>
      )}
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}

      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (manual.trim()) record(manual.trim());
          setManual('');
        }}
      >
        <input className="field" placeholder="Visitante sin Código QR? Escribe el nombre" value={manual} onChange={(e) => setManual(e.target.value)} />
        <button className="btn-primary shrink-0">Registrar</button>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">{log.length} visitantes presentes</h2>
        {log.length > 0 && (
          <button onClick={exportCsv} className="btn-ghost min-h-[36px] py-1.5 text-xs">
            <Icon name="download" className="h-4 w-4" />
            CSV
          </button>
        )}
      </div>
      {log.some((e) => !e.synced) && (
        <p className="mt-2 text-xs text-amber-700">{log.filter((e) => !e.synced).length} datos aún no enviados a Sheets — se enviarán automáticamente cuando la señal regrese.</p>
      )}
      <ul className="mt-3 divide-y divide-line/60">
        {log.map((e) => (
          <li key={e.at} className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-medium">{e.name}</span>
            <span className="text-xs text-muted">
              {new Date(e.at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              {!e.synced && ' · no sincronizado'}
            </span>
          </li>
        ))}
      </ul>

      {log.length > 0 && (
        <button
          onClick={() => {
            if (!confirm('¿Deseas eliminar todos los datos de check-in en este teléfono? Los datos en Google Sheets no se eliminarán.')) return;
            localStorage.removeItem(STORE);
            setLog([]);
          }}
          className="mt-8 w-full text-center text-xs text-muted underline underline-offset-4"
        >
          Eliminar datos de check-in en este teléfono (por ejemplo, después de la prueba)
        </button>
      )}
    </main>
  );
}
