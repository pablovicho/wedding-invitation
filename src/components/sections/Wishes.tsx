'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { useInvitation } from '@/components/InvitationProvider';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { toast } from '@/components/ui/Toast';
import Turnstile, { turnstileEnabled } from '@/components/ui/Turnstile';
import { addWish, listWishes, wishesBackend, type Wish } from '@/lib/wishes';

const SENT_KEY = 'wish-sent-at';

function timeAgo(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'recién';
  if (s < 3600) return `${Math.floor(s / 60)} minutos atrás`;
  if (s < 86400) return `${Math.floor(s / 3600)} horas atrás`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} días atrás`;
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Wishes() {
  const { guest } = useInvitation();
  const { pageSize } = wedding.wishes;
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const load = useCallback(
    async (from: number) => {
      setLoading(true);
      setError('');
      try {
        const { items, total } = await listWishes(from, pageSize);
        setWishes((prev) => (from === 0 ? items : [...prev, ...items]));
        setTotal(total);
      } catch (err) {
        console.error(err);
        setError('No se pueden cargar los deseos. Intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  // Cargar datos solo cuando la sección se acerque a la pantalla (ahorra cuota del invitado)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !wishesBackend) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          load(0);
          io.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronizar una vez desde la cadena de consulta
    if (guest) setName((n) => n || guest);
  }, [guest]);

  if (!wedding.wishes.enabled || !wishesBackend) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const msg = message.trim();
    if (!n || !msg) return;
    // Freno simple anti-spam: 1 mensaje cada 30 segundos por dispositivo
    try {
      const last = Number(localStorage.getItem(SENT_KEY) ?? 0);
      if (Date.now() - last < 30_000) {
        toast('Espera un poco antes de enviar otro');
        return;
      }
    } catch {
      // localStorage puede estar bloqueado (modo privado) — ignorar
    }
    setSending(true);
    try {
      const wish = await addWish(n.slice(0, 60), msg.slice(0, 500), turnstileToken);
      setWishes((prev) => [wish, ...prev]);
      setTotal((t) => t + 1);
      setMessage('');
      toast('Gracias por tu aporte 🤍');
      setTurnstileToken('');
      setTurnstileKey((k) => k + 1);
      try {
        localStorage.setItem(SENT_KEY, String(Date.now()));
      } catch {}
    } catch (err) {
      console.error(err);
      toast('Fallo al enviar, intenta de nuevo');
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="wishes">
      <div ref={sectionRef}>
        <SectionTitle eyebrow="Deseos" title="Deseos y Mensajes">
          Envía tus mejores deseos y mensajes para nosotros. 
          ¡También aceptamos recomendaciones de actividades para la boda!
        </SectionTitle>

        <Reveal>
          <form onSubmit={submit} className="card space-y-3 p-5">
            <input className="field" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoComplete="name" />
            <div className="relative">
              <textarea
                className="field resize-none pb-6"
                rows={4}
                placeholder="Escribe tu mensaje…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                required
              />
              <span className="absolute bottom-2 right-3 text-[11px] text-muted">{message.length}/500</span>
            </div>
              <div className="flex justify-center m-0 p-0">
                <div className="m-0 p-0 -mt-3 mb-4 h-10" style={{ transform: 'scale(0.75)', transformOrigin: 'bottom center' }}>
                  <Turnstile key={turnstileKey} onToken={setTurnstileToken} size="normal" />
                </div>
              </div>
            <button type="submit" disabled={sending || (turnstileEnabled && !turnstileToken)} className="btn-primary w-full">
              <Icon name="send" className="h-4 w-4" />
              {sending ? 'Enviando…' : 'Enviar Mensaje'}
            </button>
          </form>
        </Reveal>

        <div className="mt-6">
          {total > 0 && <p className="mb-3 text-center text-xs uppercase tracking-widest text-muted">{total} deseos</p>}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <ul className="max-h-[32rem] space-y-3 overflow-y-auto overscroll-contain pr-1">
            {wishes.map((w) => (
              <li key={w.id} className="card flex gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 font-heading text-lg font-semibold uppercase text-primary">
                  {w.name.trim().charAt(0) || '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{w.name}</p>
                    <span className="shrink-0 text-[11px] text-muted">{timeAgo(w.created_at)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted [overflow-wrap:anywhere]">{w.message}</p>
                </div>
              </li>
            ))}
            {loading && Array.from({ length: 2 }, (_, i) => <li key={`s${i}`} className="card h-20 animate-pulse opacity-60" />)}
          </ul>
          {!loading && wishes.length < total && (
            <div className="mt-4 text-center">
              <button onClick={() => load(wishes.length)} className="btn-ghost">
                Ver más deseos
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
