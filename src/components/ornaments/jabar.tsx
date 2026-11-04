/* Motivo de Java Occidental para el tema Priangan: gunungan de wayang golek y nube mega mendung (Cirebon). */

type SvgProps = React.SVGProps<SVGSVGElement>;

/** Gunungan/kayon de wayang: forma de hoja-montaña con árbol de la vida y puerta */
export function Gunungan(props: SvgProps) {
  const outline = 'M60 2C74 30 108 66 110 112 112 146 92 160 60 160 28 160 8 146 10 112 12 66 46 30 60 2Z';
  return (
    <svg viewBox="0 0 120 172" aria-hidden {...props}>
      <path d={outline} className="fill-primary/10 stroke-accent" strokeWidth={1.6} />
      <path d={outline} transform="translate(60 92) scale(.86) translate(-60 -92)" fill="none" className="stroke-accent/70" strokeWidth={0.8} />
      {/* Árbol de la vida */}
      <g fill="none" className="stroke-primary" strokeWidth={1.3} strokeLinecap="round">
        <path d="M60 128V26" />
        {[40, 58, 76, 94].map((y, i) => {
          const spread = 14 + i * 7;
          return (
            <g key={y}>
              <path d={`M60 ${y + 8}C${60 - spread * 0.5} ${y + 4} ${60 - spread} ${y - 4} ${60 - spread} ${y - 12}c0-5 6-6 7-2`} />
              <path d={`M60 ${y + 8}C${60 + spread * 0.5} ${y + 4} ${60 + spread} ${y - 4} ${60 + spread} ${y - 12}c0-5-6-6-7-2`} />
            </g>
          );
        })}
      </g>
      <g className="fill-accent">
        {[
          [44, 30],
          [76, 30],
          [36, 50],
          [84, 50],
          [30, 70],
          [90, 70],
          [26, 90],
          [94, 90],
          [60, 22],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} />
        ))}
      </g>
      {/* Puerta */}
      <path d="M40 160V132H80V160" className="fill-surface stroke-accent" strokeWidth={1.2} />
      <path d="M50 160V146A10 10 0 0 1 70 146V160" className="fill-primary/80" />
      <path d="M34 132H86L80 124H40Z" className="fill-accent" />
      <path d="M22 166H98" className="stroke-accent" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const CLOUD = 'M10 55C2 55 2 41 12 40 8 28 24 22 32 30 34 14 56 10 62 24 68 8 94 10 94 28 106 22 118 34 110 44 120 48 116 58 106 55Z';
const CLOUD_TONES = ['fill-primary', 'fill-primary/75', 'fill-accent', 'fill-accent/60', 'fill-surface'];

/** Una nube mega mendung: líneas de nube en capas, que se estrechan hacia abajo y al centro */
export function MegaMendungCloud({ x = 0, y = 0, scale = 1, flip = false }: { x?: number; y?: number; scale?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {[1, 0.82, 0.64, 0.46, 0.28].map((s, i) => (
        <path key={s} d={CLOUD} transform={`translate(60 56) scale(${s}) translate(-60 -56)`} className={CLOUD_TONES[i]} />
      ))}
    </g>
  );
}

/** Franja de nubes mega mendung para la parte inferior de la pantalla */
export function MegaMendungBand(props: SvgProps) {
  return (
    <svg viewBox="0 0 360 70" preserveAspectRatio="xMidYMax meet" aria-hidden {...props}>
      <MegaMendungCloud x={-30} y={18} scale={0.9} />
      <MegaMendungCloud x={250} y={14} scale={0.95} />
      <MegaMendungCloud x={230} y={10} scale={0.7} flip />
      <MegaMendungCloud x={100} y={4} scale={1.25} />
    </svg>
  );
}
