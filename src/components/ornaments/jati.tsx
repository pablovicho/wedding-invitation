/* Tema Jati — coklat earthy/boho: rumput pampas, pelangi lengkung, daun kering. */
import { Branch } from './taman';

type SvgProps = React.SVGProps<SVGSVGElement>;
type Pt = [number, number];

/** Rumput pampas: batang melengkung dengan bulu halus di ujungnya */
export function Pampas({ from, ctrl, to }: { from: Pt; ctrl: Pt; to: Pt }) {
  const at = (t: number): Pt => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * to[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * to[1],
  ];
  const angle = (t: number) =>
    Math.atan2(
      2 * (1 - t) * (ctrl[1] - from[1]) + 2 * t * (to[1] - ctrl[1]),
      2 * (1 - t) * (ctrl[0] - from[0]) + 2 * t * (to[0] - ctrl[0]),
    );
  const strokes: string[] = [];
  for (let t = 0.42; t <= 1; t += 0.025) {
    const [x, y] = at(t);
    const a = angle(t);
    const len = 11 * Math.sin(Math.PI * Math.min(1, (t - 0.38) / 0.66)) + 2;
    for (const side of [1, -1]) {
      const b = a + side * 0.6;
      strokes.push(`M${x.toFixed(1)} ${y.toFixed(1)}l${(Math.cos(b) * len).toFixed(1)} ${(Math.sin(b) * len).toFixed(1)}`);
    }
  }
  return (
    <g fill="none" strokeLinecap="round">
      <path d={`M${from[0]} ${from[1]}Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`} className="stroke-primary/70" strokeWidth={1.1} />
      <path d={strokes.join('')} className="stroke-accent/60" strokeWidth={0.8} />
    </g>
  );
}

export function JatiCorner(props: SvgProps) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden {...props}>
      <Pampas from={[0, 30]} ctrl={[60, 20]} to={[140, 40]} />
      <Pampas from={[30, 0]} ctrl={[20, 60]} to={[40, 140]} />
      <Branch from={[0, 0]} ctrl={[50, 30]} to={[100, 96]} leaves={6} round={false} scale={1} />
      <g className="fill-primary/70">
        <circle cx={60} cy={56} r={2.4} />
        <circle cx={68} cy={50} r={1.6} />
        <circle cx={52} cy={64} r={1.6} />
      </g>
    </svg>
  );
}

/** Pelangi lengkung ala boho */
function Rainbow({ cx, cy, r, w }: { cx: number; cy: number; r: number[]; w: number }) {
  const tones = ['stroke-primary', 'stroke-accent', 'stroke-accent/50', 'stroke-primary/40'];
  return (
    <g fill="none" strokeLinecap="round">
      {r.map((rr, i) => (
        <path key={rr} d={`M${cx - rr} ${cy}A${rr} ${rr} 0 0 1 ${cx + rr} ${cy}`} className={tones[i % tones.length]} strokeWidth={w} />
      ))}
    </g>
  );
}

export function JatiDivider(props: SvgProps) {
  return (
    <svg viewBox="0 0 240 30" aria-hidden {...props}>
      <g className="stroke-accent/70" strokeWidth={0.8}>
        <path d="M6 24H98M142 24H234" />
      </g>
      <Rainbow cx={120} cy={24} r={[16, 11.5, 7]} w={3} />
      <g className="fill-primary/70">
        <circle cx={104} cy={24} r={1.5} />
        <circle cx={136} cy={24} r={1.5} />
      </g>
    </svg>
  );
}

export function JatiCrest(props: SvgProps) {
  return (
    <svg viewBox="0 0 200 90" aria-hidden {...props}>
      <Pampas from={[70, 86]} ctrl={[40, 70]} to={[24, 16]} />
      <Pampas from={[130, 86]} ctrl={[160, 70]} to={[176, 16]} />
      <Rainbow cx={100} cy={84} r={[40, 31, 22, 13]} w={6.5} />
      <circle cx={100} cy={84} r={4} className="fill-accent" />
    </svg>
  );
}
