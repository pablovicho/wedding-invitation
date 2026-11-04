'use client';

import { useEffect, useState } from 'react';
import Icon, { type IconName } from './ui/Icon';

// Etiqueta e icono por sección. El orden y la visibilidad NO se definen aquí:
// la nav sigue las secciones que realmente existen en la página, según su orden.
const ITEMS: { id: string; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Beranda', icon: 'home' },
  { id: 'couple', label: 'Mempelai', icon: 'heart' },
  { id: 'event', label: 'Acara', icon: 'calendar' },
  { id: 'gallery', label: 'Galeri', icon: 'image' },
  { id: 'rsvp', label: 'RSVP', icon: 'rsvp' },
  { id: 'wishes', label: 'Ucapan', icon: 'chat' },
  { id: 'gift', label: 'Hadiah', icon: 'gift' },
];

type Item = (typeof ITEMS)[number];

export default function BottomNav() {
  const [items, setItems] = useState<Item[]>(ITEMS.slice(0, 3));
  const [active, setActive] = useState('home');

  useEffect(() => {
    const present = ITEMS.map((it) => ({ it, el: document.getElementById(it.id) }))
      .filter((x): x is { it: Item; el: HTMLElement } => x.el !== null)
      .sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- se necesita el DOM para saber qué sección está activa
    setItems(present.map((x) => x.it));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { el } of present) io.observe(el);
    return () => io.disconnect();
  }, []);

  // Los 7 botones deben caber igualmente en un teléfono de 360px
  const pad = items.length > 6 ? 'px-2' : 'px-2.5';

  return (
    <nav aria-label="Navigasi undangan" className="rounded-full border border-line/80 bg-surface/85 p-1.5 shadow-xl backdrop-blur-md">
      <ul className="flex items-center">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-label={it.label}
                aria-current={on ? 'true' : undefined}
                className={`flex h-10 items-center gap-1.5 rounded-full ${pad} text-[11px] font-semibold transition-all duration-300 ${
                  on ? 'bg-primary text-on-primary' : 'text-muted'
                }`}
              >
                <Icon name={it.icon} className="h-[18px] w-[18px]" />
                {on && <span>{it.label}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
