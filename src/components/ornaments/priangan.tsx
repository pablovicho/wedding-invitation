/* Tema Priangan — elemen pengantin Sunda: siger, ronce melati, motif kawung, filigri emas. */
import { MelatiBud, MelatiGlyph } from './shapes';

type SvgProps = React.SVGProps<SVGSVGElement>;

/** Siger (mahkota pengantin Sunda) yang disederhanakan */
export function Siger(props: SvgProps) {
  const curveY = (x: number) => {
    const t = (x - 14) / 172;
    return 80 - 100 * t * (1 - t);
  };
  const spikes = [
    { x: 34, tip: 46, w: 6 },
    { x: 166, tip: 46, w: 6 },
    { x: 54, tip: 30, w: 8 },
    { x: 146, tip: 30, w: 8 },
    { x: 76, tip: 16, w: 10 },
    { x: 124, tip: 16, w: 10 },
    { x: 100, tip: 5, w: 13 },
  ];
  return (
    <svg viewBox="0 0 200 92" aria-hidden {...props}>
      <g className="fill-accent/15 stroke-accent" strokeWidth={1.1} strokeLinejoin="round">
        {spikes.map(({ x, tip, w }) => {
          const by = curveY(x) + 3;
          const h = by - tip;
          return (
            <g key={x}>
              <path
                d={`M${x - w} ${by}C${x - w} ${by - h * 0.55} ${x - w * 0.2} ${tip + h * 0.25} ${x} ${tip}C${x + w * 0.2} ${tip + h * 0.25} ${x + w} ${by - h * 0.55} ${x + w} ${by}Z`}
              />
              <path d={`M${x} ${by - 3}V${tip + h * 0.3}`} fill="none" strokeWidth={0.6} />
              <circle cx={x} cy={tip - 3.2} r={2.1} className="fill-accent" stroke="none" />
            </g>
          );
        })}
      </g>
      <path d="M14 80Q100 30 186 80L178 88Q100 44 22 88Z" className="fill-accent stroke-accent" strokeWidth={0.8} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 30 + i * 11.7;
        return <circle key={i} cx={x} cy={curveY(x) + 4.5} r={1.5} fill="#fffdf7" />;
      })}
      <MelatiGlyph x={100} y={58} scale={0.85} />
    </svg>
  );
}

/** Ronce melati yang menjuntai (vertikal) */
export function MelatiStrand({ buds = 12, ...props }: SvgProps & { buds?: number }) {
  const h = buds * 13 + 22;
  return (
    <svg viewBox={`0 0 24 ${h}`} aria-hidden {...props}>
      <path d={`M12 0V${h - 10}`} className="stroke-accent" strokeWidth={0.8} opacity={0.7} />
      {Array.from({ length: buds }, (_, i) =>
        i % 5 === 2 ? (
          <MelatiGlyph key={i} x={12} y={10 + i * 13} scale={0.75} rotate={i * 17} />
        ) : (
          <MelatiBud key={i} x={12} y={10 + i * 13} rotate={i % 2 ? 14 : -14} />
        ),
      )}
      <MelatiGlyph x={12} y={h - 9} scale={0.7} />
    </svg>
  );
}

export function PrianganCorner(props: SvgProps) {
  return (
    <svg viewBox="0 0 140 140" aria-hidden {...props}>
      <g fill="none" className="stroke-accent" strokeLinecap="round">
        <path d="M6 134V44Q6 6 44 6H134" strokeWidth={1.4} />
        <path d="M14 134V52Q14 14 52 14H134" strokeWidth={0.6} />
        <path d="M14 84C30 84 44 70 40 56 36 44 24 46 26 56" strokeWidth={1} />
        <path d="M84 14C84 30 70 44 56 40 44 36 46 24 56 26" strokeWidth={1} />
        <path d="M22 110C36 102 40 90 34 82" strokeWidth={0.8} />
        <path d="M110 22C102 36 90 40 82 34" strokeWidth={0.8} />
      </g>
      <g className="fill-accent">
        <path d="M134 2l4 4-4 4-4-4z" />
        <path d="M2 134l4-4 4 4-4 4z" />
        {[100, 112, 122].map((v) => (
          <g key={v}>
            <circle cx={v} cy={24} r={1.2} />
            <circle cx={24} cy={v} r={1.2} />
          </g>
        ))}
      </g>
      <MelatiBud x={70} y={30} rotate={62} />
      <MelatiBud x={30} y={70} rotate={28} />
      <MelatiGlyph x={58} y={22} scale={0.7} rotate={10} />
      <MelatiGlyph x={22} y={58} scale={0.7} rotate={20} />
      <MelatiGlyph x={34} y={34} scale={1.15} />
    </svg>
  );
}

export function PrianganDivider(props: SvgProps) {
  return (
    <svg viewBox="0 0 240 30" aria-hidden {...props}>
      <g className="stroke-accent" strokeWidth={0.8}>
        <path d="M4 15H86M154 15H236" />
      </g>
      <g className="fill-accent">
        <path d="M96 11l4 4-4 4-4-4z" />
        <path d="M144 11l4 4-4 4-4-4z" />
        <circle cx={80} cy={15} r={1.4} />
        <circle cx={160} cy={15} r={1.4} />
      </g>
      <MelatiBud x={109} y={15} rotate={90} />
      <MelatiBud x={131} y={15} rotate={90} />
      <MelatiGlyph x={120} y={15} scale={1.15} />
    </svg>
  );
}

/** Pola kawung untuk latar (ditile) */
export function KawungPattern({ id }: { id: string }) {
  return (
    <pattern id={id} width={48} height={48} patternUnits="userSpaceOnUse">
      <g fill="none" stroke="currentColor" strokeWidth={0.8}>
        <ellipse cx={12} cy={12} rx={10} ry={5.5} transform="rotate(45 12 12)" />
        <ellipse cx={36} cy={12} rx={10} ry={5.5} transform="rotate(-45 36 12)" />
        <ellipse cx={12} cy={36} rx={10} ry={5.5} transform="rotate(-45 12 36)" />
        <ellipse cx={36} cy={36} rx={10} ry={5.5} transform="rotate(45 36 36)" />
      </g>
      <g fill="currentColor">
        <circle cx={24} cy={24} r={1.6} />
        <circle cx={0} cy={0} r={1.6} />
        <circle cx={48} cy={0} r={1.6} />
        <circle cx={0} cy={48} r={1.6} />
        <circle cx={48} cy={48} r={1.6} />
      </g>
    </pattern>
  );
}
