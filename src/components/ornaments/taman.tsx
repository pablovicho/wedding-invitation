/* Tema Taman — ramas de eucalipto y hojas line-art, generadas a partir de curvas para que queden ordenadas. */
import { LEAF_PATH, ROUND_LEAF_PATH } from './shapes';

type SvgProps = React.SVGProps<SVGSVGElement>;
type Pt = [number, number];

const LEAF_TONES = ['fill-primary/80', 'fill-primary/55', 'fill-accent/60', 'fill-primary/70'];

/** Rama con hojas alternas a lo largo de la curva cuadrática from -> ctrl -> to */
export function Branch({
  from,
  ctrl,
  to,
  leaves = 7,
  round = true,
  scale = 1,
}: {
  from: Pt;
  ctrl: Pt;
  to: Pt;
  leaves?: number;
  round?: boolean;
  scale?: number;
}) {
  const at = (t: number): Pt => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * to[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * to[1],
  ];
  const angle = (t: number) => {
    const dx = 2 * (1 - t) * (ctrl[0] - from[0]) + 2 * t * (to[0] - ctrl[0]);
    const dy = 2 * (1 - t) * (ctrl[1] - from[1]) + 2 * t * (to[1] - ctrl[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const path = round ? ROUND_LEAF_PATH : LEAF_PATH;

  return (
    <g>
      <path
        d={`M${from[0]} ${from[1]}Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`}
        fill="none"
        className="stroke-primary/70"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      {Array.from({ length: leaves }, (_, i) => {
        const t = 0.12 + (i * 0.82) / leaves;
        const [x, y] = at(t);
        const side = i % 2 === 0 ? 1 : -1;
        const s = scale * (1.15 - 0.45 * t);
        return (
          <path
            key={i}
            d={path}
            className={LEAF_TONES[i % LEAF_TONES.length]}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(angle(t) + side * 52).toFixed(1)}) scale(${s.toFixed(2)})`}
          />
        );
      })}
      <path
        d={path}
        className="fill-primary/75"
        transform={`translate(${to[0]} ${to[1]}) rotate(${angle(1).toFixed(1)}) scale(${(scale * 0.7).toFixed(2)})`}
      />
    </g>
  );
}

export function TamanCorner(props: SvgProps) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden {...props}>
      <Branch from={[0, 6]} ctrl={[64, 8]} to={[132, 58]} leaves={8} />
      <Branch from={[6, 0]} ctrl={[8, 64]} to={[58, 132]} leaves={8} />
      <Branch from={[0, 0]} ctrl={[44, 36]} to={[96, 96]} leaves={6} round={false} scale={0.9} />
      <g className="fill-accent">
        <circle cx={70} cy={30} r={2.6} />
        <circle cx={76} cy={36} r={2} />
        <circle cx={30} cy={72} r={2.6} />
        <circle cx={36} cy={78} r={2} />
      </g>
    </svg>
  );
}

export function TamanDivider(props: SvgProps) {
  return (
    <svg viewBox="0 0 240 40" aria-hidden {...props}>
      <Branch from={[114, 20]} ctrl={[76, 10]} to={[22, 22]} leaves={7} scale={0.75} />
      <Branch from={[126, 20]} ctrl={[164, 10]} to={[218, 22]} leaves={7} scale={0.75} />
      <g className="fill-accent">
        <circle cx={120} cy={20} r={3.4} />
        <circle cx={120} cy={11} r={1.6} />
        <circle cx={120} cy={29} r={1.6} />
      </g>
    </svg>
  );
}

/** Semicírculo (laurel) sobre el nombre */
export function TamanCrest(props: SvgProps) {
  return (
    <svg viewBox="0 0 200 90" aria-hidden {...props}>
      <Branch from={[96, 86]} ctrl={[26, 84]} to={[34, 14]} leaves={9} scale={0.85} />
      <Branch from={[104, 86]} ctrl={[174, 84]} to={[166, 14]} leaves={9} scale={0.85} />
      <circle cx={100} cy={84} r={3} className="fill-accent" />
    </svg>
  );
}

/** Puntos finos para el fondo */
export function DotPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={28} height={28} patternUnits="userSpaceOnUse">
      <circle cx={14} cy={14} r={1.1} fill="currentColor" />
    </pattern>
  );
}
