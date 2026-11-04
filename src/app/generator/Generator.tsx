'use client';

import { useEffect, useMemo, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { copyText } from '@/lib/clipboard';
import { coupleNames } from '@/lib/couple';
import { longDate } from '@/lib/date';
import { waLink } from '@/lib/whatsapp';

const DEFAULT_TEMPLATE = `Hola

Estimado/a,
*{nombre}*

Nos complace invitarte a asistir a nuestro matrimonio el ${longDate(wedding.events[0].date, wedding.timezone)}.

Para más información sobre el evento, consulta el siguiente enlace:
{link}

¡Nos encantaría contar con tu presencia!

Gracias,
*${coupleNames}*`;

interface Guest {
  name: string;
  phone?: string;
}

function parse(text: string): Guest[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      // Formato: "Nombre" o "Nombre, 0812xxxx"
      const m = line.match(/^(.*?)[,;\t]\s*(\+?[\d\s-]{8,})$/);
      return m ? { name: m[1].trim(), phone: m[2] } : { name: line };
    });
}

export default function Generator() {
  const [base, setBase] = useState('');
  const [names, setNames] = useState('Marce y Pablo\n, 081234567890');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const url = wedding.site.url || `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pero necesitamos window.location
    setBase(url.replace(/\/$/, '') + '/');
  }, []);

  const guests = useMemo(() => parse(names), [names]);
  const linkFor = (g: Guest) => `${base}?to=${encodeURIComponent(g.name)}`;
  const messageFor = (g: Guest) => template.replaceAll('{nombre}', g.name).replaceAll('{link}', linkFor(g));

  const copy = async (i: number, text: string) => {
    if (await copyText(text)) {
      setCopied(i);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold text-primary">Generador de Enlaces para Invitaciones</h1>
      <p className="mt-1 text-sm text-muted">
        Esta página solo es para ti (no se indexa en Google). Un nombre por línea, agrega el número de WhatsApp después de la coma si deseas enviar directamente.
      </p>

      <label className="mt-6 block text-sm font-medium">
        URL de la invitación
        <input className="field mt-1" value={base} onChange={(e) => setBase(e.target.value)} />
      </label>

      <label className="mt-4 block text-sm font-medium">
        Lista de invitados
        <textarea className="field mt-1 font-mono text-sm" rows={6} value={names} onChange={(e) => setNames(e.target.value)} />
      </label>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium">Plantilla de mensaje ({'{nombre}'} &amp; {'{link}'} serán reemplazados automáticamente)</summary>
        <textarea className="field mt-2 text-sm" rows={14} value={template} onChange={(e) => setTemplate(e.target.value)} />
      </details>

      <ul className="mt-8 space-y-3">
        {guests.map((g, i) => (
          <li key={`${g.name}-${i}`} className="card p-4">
            <p className="font-semibold">{g.name}</p>
            {g.phone && <p className="text-xs text-muted">{g.phone}</p>}
            <a href={linkFor(g)} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-primary underline">
              {linkFor(g)}
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => copy(i, messageFor(g))} className="btn-ghost min-h-[36px] py-1.5 text-xs">
                {copied === i ? 'Copiado ✓' : 'Copiar mensaje'}
              </button>
              <button onClick={() => copy(i, linkFor(g))} className="btn-ghost min-h-[36px] py-1.5 text-xs">
                Copiar enlace
              </button>
              <a href={waLink(messageFor(g), g.phone)} target="_blank" rel="noreferrer" className="btn-primary min-h-[36px] py-1.5 text-xs">
                Enviar WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
