'use client';

import { useEffect, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import { useInvitation } from '@/components/InvitationProvider';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import SectionTitle from '@/components/ui/SectionTitle';
import { coupleNames } from '@/lib/couple';
import { longDate } from '@/lib/date';
import { sheetsConfigured, sheetsPost } from '@/lib/sheets';
import { waLink } from '@/lib/whatsapp';

const OPTIONS = ['Hadir', 'Tidak Hadir', 'Masih Ragu'] as const;

export default function Rsvp() {
  const { guest } = useInvitation();
  const { rsvp, timezone } = wedding;
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<(typeof OPTIONS)[number]>('Hadir');
  const [count, setCount] = useState(1);
  const [note, setNote] = useState('');

  // Isi otomatis dari link ?to=, tapi jangan timpa yang sudah diketik tamu
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkron sekali dari query string
    if (guest) setName((n) => n || guest);
  }, [guest]);

  if (!rsvp.enabled) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `Assalamu'alaikum, saya *${name.trim()}* ingin konfirmasi kehadiran di pernikahan ${coupleNames}.`,
      '',
      `Kehadiran: *${attendance}*`,
      attendance !== 'Tidak Hadir' ? `Jumlah tamu: ${count} orang` : '',
      note.trim() ? `Pesan: ${note.trim()}` : '',
    ].filter((l, i) => l !== '' || i === 1);
    // Catat juga ke Google Sheets (kalau diaktifkan) tanpa menunggu, supaya WhatsApp tetap langsung terbuka
    if (sheetsConfigured) {
      sheetsPost('rsvp', { name: name.trim(), attendance, count: attendance === 'Tidak Hadir' ? 0 : count, note: note.trim() }).catch(console.error);
    }
    window.open(waLink(lines.join('\n'), rsvp.whatsapp), '_blank', 'noopener');
  };

  return (
    <Section id="rsvp">
      <SectionTitle eyebrow="RSVP" title="Konfirmasi Kehadiran">
        Bantu kami menyiapkan yang terbaik dengan konfirmasi kehadiran
        {rsvp.deadline ? ` sebelum ${longDate(rsvp.deadline, timezone)}` : ''}.
      </SectionTitle>

      <Reveal>
        <form onSubmit={submit} className="card space-y-5 p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Nama</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} autoComplete="name" placeholder="Nama kamu" />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Kehadiran</legend>
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => setAttendance(o)}
                  aria-pressed={attendance === o}
                  className={`min-h-[44px] rounded-2xl border px-2 text-sm font-medium transition ${
                    attendance === o ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-ink'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </fieldset>

          {attendance !== 'Tidak Hadir' && (
            <div>
              <span className="mb-1.5 block text-sm font-medium">Jumlah tamu</span>
              <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-1.5">
                <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="h-11 w-11 rounded-xl bg-primary/10 text-xl text-primary" aria-label="Kurangi">
                  −
                </button>
                <span className="text-lg font-semibold tabular-nums">{count} orang</span>
                <button
                  type="button"
                  onClick={() => setCount((c) => Math.min(rsvp.maxGuests, c + 1))}
                  className="h-11 w-11 rounded-xl bg-primary/10 text-xl text-primary"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Pesan (opsional)</span>
            <textarea className="field resize-none" rows={3} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          <button type="submit" className="btn-primary w-full">
            <Icon name="whatsapp" />
            Kirim via WhatsApp
          </button>
        </form>
      </Reveal>
    </Section>
  );
}
