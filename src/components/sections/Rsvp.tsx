'use client';

import { useEffect, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { useInvitation } from '@/components/InvitationProvider';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import Turnstile, { turnstileEnabled } from '@/components/ui/Turnstile';
import { coupleNames } from '@/lib/couple';
import { longDate } from '@/lib/date';
import { sheetsConfigured, sheetsPost } from '@/lib/sheets';
import { waLink } from '@/lib/whatsapp';

const OPCIONES = ['Asistiré', 'No Asistiré', 'Aún No Decido'] as const;

export default function Rsvp() {
  const { guest } = useInvitation();
  const { rsvp, timezone } = wedding;
  const [nombre, setNombre] = useState('');
  const [asistencia, setAsistencia] = useState<(typeof OPCIONES)[number]>('Asistiré');
  const [cantidad, setCantidad] = useState(1);
  const [notas, setNotas] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  // Llenar automáticamente desde el enlace ?to=, pero no sobrescribir lo que ya se ha escrito por el invitado
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronizar solo una vez desde la cadena de consulta
    if (guest) setNombre((n) => n || guest);
  }, [guest]);

  if (!rsvp.enabled) return null;

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const lineas = [
      `Hola, yo *${nombre.trim()}* quiero confirmar mi asistencia a la boda de ${coupleNames}.`,
      '',
      `Asistencia: *${asistencia}*`,
      asistencia !== 'No Asistiré' ? `Cantidad de invitados: ${cantidad} personas` : '',
      notas.trim() ? `Notas: ${notas.trim()}` : '',
    ].filter((l, i) => l !== '' || i === 1);
    // Registrar también en Google Sheets (si está configurado) sin esperar, para que WhatsApp se abra de inmediato
    if (sheetsConfigured) {
      sheetsPost('rsvp', {
        nombre: nombre.trim(),
        asistencia,
        cantidad: asistencia === 'No Asistiré' ? 0 : cantidad,
        notas: notas.trim(),
        turnstileToken,
      }).catch(console.error);
    }
    setTurnstileToken('');
    setTurnstileKey((k) => k + 1);
    window.open(waLink(lineas.join('\n'), rsvp.whatsapp), '_blank', 'noopener');
  };

  return (
    <Section id="rsvp">
      <SectionTitle eyebrow="RSVP" title="Confirmación de Asistencia">
        Ayúdanos a preparar lo mejor con la confirmación de tu asistencia
        {rsvp.deadline ? ` antes del ${longDate(rsvp.deadline, timezone)}` : ''}.
      </SectionTitle>

      <Reveal>
        <form onSubmit={enviar} className="card space-y-5 p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Nombre</span>
            <input className="field" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={60} autoComplete="name" placeholder="Tu nombre" />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Asistencia</legend>
            <div className="grid grid-cols-3 gap-2">
              {OPCIONES.map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setAsistencia(o)}
                  aria-pressed={asistencia === o}
                  className={`min-h-[44px] rounded-2xl border px-2 text-sm font-medium transition ${
                    asistencia === o ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-ink'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          {asistencia !== 'No Asistiré' && (
            <div>
              <span className="mb-1.5 block text-sm font-medium">Cantidad de invitados</span>
              <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-1.5">
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} className="h-11 w-11 rounded-xl bg-primary/10 text-xl text-primary" aria-label="Disminuir">
                  −
                </button>
                <span className="text-lg font-semibold tabular-nums">{cantidad} personas</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(rsvp.maxGuests, c + 1))}
                  className="h-11 w-11 rounded-xl bg-primary/10 text-xl text-primary"
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Notas (opcional)</span>
            <textarea 
              className="field resize-none placeholder:text-sm placeholder:text-gray-500"
              rows={3} 
              maxLength={300} 
              value={notas} 
              placeholder="¿Cuántos adultos y cuántos niños? ¿Alguna alergia, restricción alimentaria, o necesidad especial?" 
              onChange={(e) => setNotas(e.target.value)} />
          </label>

          {sheetsConfigured && 
            <div className="flex justify-center m-0 p-0">
              <div className="m-0 p-0 -mt-3 mb-4 h-10" style={{ transform: 'scale(0.75)', transformOrigin: 'bottom center' }}>
                <Turnstile key={turnstileKey} onToken={setTurnstileToken} size="normal" />
              </div>
            </div>
          }
          <button
            type="submit"
            disabled={sheetsConfigured && turnstileEnabled && !turnstileToken}
            className="btn-primary w-full"
            >
            <Icon name="whatsapp" />
            Enviar por WhatsApp
          </button>
        </form>
      </Reveal>
    </Section>
  );
}
