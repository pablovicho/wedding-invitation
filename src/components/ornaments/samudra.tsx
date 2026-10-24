/* Tema Samudra — dusty blue: bunga bertumpuk, daun, garis ombak. */
import { Branch } from './taman';

type SvgProps = React.SVGProps<SVGSVGElement>;

/** Bunga berlapis (mirip mawar/peony dilihat dari atas) */
export function Bloom({ x = 0, y = 0, scale = 1, rotate = 0 }: { x?: number; y?: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="fill-primary/20 stroke-primary/60" strokeWidth={0.6}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <ellipse key={r} cx={0} cy={-6.5} rx={4.2} ry={6.5} transform={`rotate(${r})`} />
        ))}
      </g>
      <g className="fill-primary/45 stroke-primary/70" strokeWidth={0.5}>
        {[20, 92, 164, 236, 308].map((r) => (
          <ellipse key={r} cx={0} cy={-3.6} rx={2.8} ry={4} transform={`rotate(${r})`} />
        ))}
      </g>
      <circle r={2} className="fill-accent" />
    </g>
  );
}

export function SamudraCorner(props: SvgProps) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden {...props}>
      <Branch from={[20, 14]} ctrl={[78, 6]} to={[140, 44]} leaves={7} round={false} />
      <Branch from={[14, 20]} ctrl={[6, 78]} to={[44, 140]} leaves={7} round={false} />
      <Branch from={[24, 24]} ctrl={[70, 50]} to={[100, 100]} leaves={5} scale={0.8} />
      <Bloom x={68} y={20} scale={1} rotate={15} />
      <Bloom x={20} y={68} scale={1} rotate={40} />
      <Bloom x={30} y={30} scale={1.55} />
      <g className="fill-accent/80">
        <circle cx={92} cy={24} r={2.2} />
        <circle cx={24} cy={92} r={2.2} />
        <circle cx={56} cy={50} r={1.6} />
      </g>
    </svg>
  );
}

export function SamudraDivider(props: SvgProps) {
  const wave = (x0: number) => `M${x0} 15` + ' q5 -6 10 0 t10 0'.repeat(9);
  return (
    <svg viewBox="0 0 240 30" aria-hidden {...props}>
      <g fill="none" className="stroke-primary/60" strokeWidth={1} strokeLinecap="round">
        <path d={wave(6)} />
        <path d={wave(144)} />
      </g>
      <Bloom x={120} y={15} scale={0.95} />
    </svg>
  );
}

export function SamudraCrest(props: SvgProps) {
  return (
    <svg viewBox="0 0 200 90" aria-hidden {...props}>
      <Branch from={[92, 82]} ctrl={[30, 84]} to={[36, 18]} leaves={8} round={false} scale={0.8} />
      <Branch from={[108, 82]} ctrl={[170, 84]} to={[164, 18]} leaves={8} round={false} scale={0.8} />
      <Bloom x={78} y={80} scale={0.8} rotate={20} />
      <Bloom x={122} y={80} scale={0.8} rotate={-20} />
      <Bloom x={100} y={78} scale={1.2} />
    </svg>
  );
}

/** Pola sisik/ombak untuk latar */
export function WavePattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={40} height={20} patternUnits="userSpaceOnUse">
      <path d="M0 20A10 10 0 0 1 20 20 10 10 0 0 1 40 20M-10 10A10 10 0 0 1 10 10 10 10 0 0 1 30 10 10 10 0 0 1 50 10" fill="none" stroke="currentColor" strokeWidth={0.7} />
    </pattern>
  );
}
