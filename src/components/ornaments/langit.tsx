/* Tema Langit — bintang segi-8, bulan sabit, sparkle; ornamen gantung yang berayun. */
import { CRESCENT_PATH, SPARKLE_PATH, octagramPoints } from './shapes';

type SvgProps = React.SVGProps<SVGSVGElement>;

function Hanging({ x, length, dur, children }: { x: number; length: number; dur: number; children: React.ReactNode }) {
  return (
    <g className="animate-sway" style={{ transformOrigin: `${x}px 0px`, animationDuration: `${dur}s` }}>
      <path d={`M${x} 0V${length}`} className="stroke-primary/60" strokeWidth={0.7} />
      <g transform={`translate(${x} ${length})`}>{children}</g>
    </g>
  );
}

/** Ornamen bintang & bulan menggantung — dipakai di sudut atas */
export function LangitHanging(props: SvgProps) {
  return (
    <svg viewBox="0 0 140 170" aria-hidden {...props}>
      <Hanging x={16} length={70} dur={6}>
        <polygon points={octagramPoints(10, 0, 10)} className="fill-primary/20 stroke-primary" strokeWidth={1} />
        <circle cy={10} r={3} className="fill-primary" />
      </Hanging>
      <Hanging x={42} length={108} dur={7.5}>
        <path d={CRESCENT_PATH} transform="translate(0 13) scale(1.3)" className="fill-primary" />
      </Hanging>
      <Hanging x={66} length={46} dur={5}>
        <path d={SPARKLE_PATH} transform="translate(0 8) scale(.75)" className="fill-primary" />
      </Hanging>
      <Hanging x={90} length={88} dur={6.5}>
        <polygon points={octagramPoints(7, 0, 7)} className="fill-primary" />
      </Hanging>
      <Hanging x={114} length={32} dur={5.5}>
        <path d={SPARKLE_PATH} transform="translate(0 6) scale(.5)" className="fill-primary" />
      </Hanging>
    </svg>
  );
}

/** Kluster bintang untuk sudut bawah */
export function LangitCluster(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden {...props}>
      <polygon points={octagramPoints(22, 32, 88)} className="fill-primary/10 stroke-primary/70" strokeWidth={1} />
      <polygon points={octagramPoints(13, 32, 88)} fill="none" className="stroke-primary/50" strokeWidth={0.8} />
      <circle cx={32} cy={88} r={3} className="fill-primary" />
      <path d={SPARKLE_PATH} transform="translate(74 98) scale(.6)" className="fill-primary" />
      <path d={SPARKLE_PATH} transform="translate(58 54) scale(.35)" className="fill-primary/70" />
      <circle cx={92} cy={74} r={1.4} className="fill-primary/80" />
      <circle cx={14} cy={50} r={1.2} className="fill-primary/60" />
    </svg>
  );
}

export function LangitDivider(props: SvgProps) {
  return (
    <svg viewBox="0 0 240 30" aria-hidden {...props}>
      <defs>
        <linearGradient id="langit-line-l" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id="langit-line-r" x1="1" x2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <g className="text-primary/70">
        <rect x={4} y={14.5} width={84} height={1} fill="url(#langit-line-l)" />
        <rect x={152} y={14.5} width={84} height={1} fill="url(#langit-line-r)" />
      </g>
      <path d={SPARKLE_PATH} transform="translate(98 15) scale(.45)" className="fill-primary" />
      <path d={SPARKLE_PATH} transform="translate(142 15) scale(.45)" className="fill-primary" />
      <polygon points={octagramPoints(11, 120, 15)} className="fill-primary/15 stroke-primary" strokeWidth={0.9} />
      <polygon points={octagramPoints(5, 120, 15)} className="fill-primary" />
    </svg>
  );
}

/** Bulan sabit + bintang di atas nama */
export function LangitCrest(props: SvgProps) {
  return (
    <svg viewBox="0 0 200 90" aria-hidden {...props}>
      <path d={CRESCENT_PATH} transform="translate(96 46) scale(3.2)" className="fill-primary" />
      <polygon points={octagramPoints(7, 116, 30)} className="fill-primary" />
      <path d={SPARKLE_PATH} transform="translate(52 40) scale(.6)" className="fill-primary/80" />
      <path d={SPARKLE_PATH} transform="translate(150 58) scale(.45)" className="fill-primary/70" />
      <circle cx={66} cy={66} r={1.5} className="fill-primary/70" />
      <circle cx={140} cy={24} r={1.3} className="fill-primary/70" />
    </svg>
  );
}

export function StarPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={64} height={64} patternUnits="userSpaceOnUse">
      <polygon points={octagramPoints(11, 32, 32)} fill="none" stroke="currentColor" strokeWidth={0.7} />
      <circle cx={0} cy={0} r={1.2} fill="currentColor" />
      <circle cx={64} cy={0} r={1.2} fill="currentColor" />
      <circle cx={0} cy={64} r={1.2} fill="currentColor" />
      <circle cx={64} cy={64} r={1.2} fill="currentColor" />
    </pattern>
  );
}
