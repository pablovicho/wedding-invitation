/* Bentuk dasar SVG yang dipakai ulang oleh ornamen tiap tema. Warna lewat currentColor / class Tailwind. */

type SvgProps = React.SVGProps<SVGSVGElement>;

/** Bunga melati dilihat dari atas — 6 kelopak putih, putik emas */
export function MelatiFlower({ size = 24, ...props }: SvgProps & { size?: number }) {
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size} aria-hidden {...props}>
      <MelatiGlyph />
    </svg>
  );
}

export function MelatiGlyph({ x = 0, y = 0, scale = 1, rotate = 0 }: { x?: number; y?: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g fill="#fffdf7" className="stroke-accent" strokeWidth={0.7}>
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} d="M0-1.2C3-3 3.4-8.6 0-10.6-3.4-8.6-3-3 0-1.2Z" transform={`rotate(${r})`} />
        ))}
      </g>
      <g fill="#fffdf7" className="stroke-accent" strokeWidth={0.5} opacity={0.9}>
        {[30, 150, 270].map((r) => (
          <path key={r} d="M0-1C1.8-2.4 2-5.6 0-6.8-2-5.6-1.8-2.4 0-1Z" transform={`rotate(${r})`} />
        ))}
      </g>
      <circle r={1.7} className="fill-accent" />
    </g>
  );
}

/** Kuncup melati (untuk ronce) */
export function MelatiBud({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx={3.1} ry={5.2} fill="#fffdf7" className="stroke-accent" strokeWidth={0.6} />
      <path d="M-1.6-4.2Q0-6.6 1.6-4.2" fill="none" className="stroke-primary" strokeWidth={0.6} opacity={0.6} />
    </g>
  );
}

/** Titik-titik bintang segi-8 (rub el hizb / khatam) */
export function octagramPoints(r: number, cx = 0, cy = 0): string {
  const inner = r * 0.765;
  return Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI / 8) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : inner;
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
}

export const SPARKLE_PATH = 'M0-10C1-2 2-1 10 0 2 1 1 2 0 10-1 2-2 1-10 0-2-1-1-2 0-10Z';
export const CRESCENT_PATH = 'M3-10A10 10 0 1 0 3 10 12 12 0 0 1 3-10Z';
/** Daun lonjong menghadap ke kanan, pangkal di (0,0) */
export const LEAF_PATH = 'M0 0C3-6 12-7 17 0 12 7 3 6 0 0Z';
/** Daun eucalyptus (bulat) */
export const ROUND_LEAF_PATH = 'M0 0C1-7 11-8 13 0 11 8 1 7 0 0Z';
/** Kelopak lepas (partikel tema Samudra) */
export const PETAL_PATH = 'M0-8C5-4 5 4 0 8-5 4-5-4 0-8Z';
