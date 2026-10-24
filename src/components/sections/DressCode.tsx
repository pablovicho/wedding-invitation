'use client';

import type { DressCode as DressCodeConfig } from '@/config/types';
import { useInvitation } from '@/components/InvitationProvider';
import { themes } from '@/themes';

/** Palet dress code: mengikuti tema aktif ('theme') atau warna custom dari config. */
export default function DressCode({ value, compact = false }: { value: DressCodeConfig; compact?: boolean }) {
  const { theme } = useInvitation();
  const preset = themes[theme].dressCode;
  const colors = (value.colors === 'theme' ? preset.colors : value.colors).map((c) => (typeof c === 'string' ? { hex: c, name: '' } : c));
  const note = value.note ?? (value.colors === 'theme' ? preset.note : '');

  return (
    <div className="text-center">
      <p className={`font-semibold uppercase tracking-[0.25em] text-primary ${compact ? 'text-[10px]' : 'text-xs'}`}>Dress Code</p>
      {note && <p className={`mt-1 text-muted ${compact ? 'text-xs' : 'text-sm'}`}>{note}</p>}
      <ul className="mt-3 flex flex-wrap justify-center gap-3">
        {colors.map((c) => (
          <li key={c.hex + c.name} className="flex w-14 flex-col items-center gap-1">
            <span
              className={`rounded-full border-2 border-surface shadow ring-1 ring-line ${compact ? 'h-7 w-7' : 'h-9 w-9'}`}
              style={{ backgroundColor: c.hex }}
              title={c.name || c.hex}
            />
            {c.name && <span className="text-[10px] leading-tight text-muted">{c.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
