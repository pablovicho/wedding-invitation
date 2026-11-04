'use client';

import { useEffect, useState } from 'react';
import { wedding } from '@/config/wedding.config';
import Icon from '@/components/ui/Icon';
import { downloadIcs, googleCalendarUrl } from '@/lib/calendar';
import { coupleNames, mainEvent } from '@/lib/couple';
import { eventStart } from '@/lib/date';

const UNITS = [
  ['Hari', 86_400_000],
  ['Jam', 3_600_000],
  ['Menit', 60_000],
  ['Detik', 1000],
] as const;

function split(ms: number): number[] {
  let rest = Math.max(0, ms);
  return UNITS.map(([, size]) => {
    const v = Math.floor(rest / size);
    rest -= v * size;
    return v;
  });
}

export default function Countdown() {
  const target = eventStart(mainEvent, wedding.timezone).getTime();
  // null hasta el montaje para que el HTML estático no contenga números obsoletos
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const title = `${mainEvent.title} ${coupleNames}`;
  const done = left !== null && left <= 0;

  return (
    <div className="text-center">
      {done ? (
        <p className="card px-6 py-5 text-sm leading-relaxed">
          Alhamdulillah, acara telah berlangsung. Terima kasih atas doa dan kehadirannya 🤍
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {split(left ?? 0).map((v, i) => (
            <div key={UNITS[i][0]} className="card px-1 py-3">
              <p className="font-heading text-3xl font-semibold tabular-nums text-primary">{left === null ? '–' : String(v).padStart(2, '0')}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">{UNITS[i][0]}</p>
            </div>
          ))}
        </div>
      )}

      {!done && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <a href={googleCalendarUrl(mainEvent, wedding.timezone, title)} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <Icon name="calendar" className="h-4 w-4" />
            Google Calendar
          </a>
          <button onClick={() => downloadIcs(mainEvent, wedding.timezone, title)} className="btn-ghost">
            <Icon name="calendar" className="h-4 w-4" />
            iPhone / Lainnya
          </button>
        </div>
      )}
    </div>
  );
}
