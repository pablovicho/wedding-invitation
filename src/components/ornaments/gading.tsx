/* Tema Gading — krem minimalis editorial: garis art-deco tipis, monogram, kilau halus. */
import { couple } from '@/lib/couple';
import { SPARKLE_PATH } from './shapes';

type SvgProps = React.SVGProps<SVGSVGElement>;

export function GadingCorner(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden {...props}>
      <g fill="none" className="stroke-accent" strokeLinecap="round">
        <path d="M6 116V6H116" strokeWidth={0.9} />
        <path d="M13 96V13H96" strokeWidth={0.5} />
        <path d="M13 44A31 31 0 0 0 44 13" strokeWidth={0.6} />
        <path d="M13 30A17 17 0 0 0 30 13" strokeWidth={0.6} />
      </g>
      <path d={SPARKLE_PATH} transform="translate(26 26) scale(.55)" className="fill-accent" />
      <g className="fill-accent">
        <circle cx={60} cy={6} r={1.3} />
        <circle cx={6} cy={60} r={1.3} />
        <path d="M116 3l3 3-3 3-3-3zM3 116l3-3 3 3-3 3z" />
      </g>
    </svg>
  );
}

export function GadingDivider(props: SvgProps) {
  return (
    <svg viewBox="0 0 240 30" aria-hidden {...props}>
      <g className="stroke-accent" strokeWidth={0.7}>
        <path d="M22 15H106M134 15H218" />
      </g>
      <path d="M120 9l6 6-6 6-6-6z" fill="none" className="stroke-accent" strokeWidth={0.9} />
      <g className="fill-accent">
        <circle cx={120} cy={15} r={1.5} />
        <circle cx={110} cy={15} r={1.2} />
        <circle cx={130} cy={15} r={1.2} />
      </g>
    </svg>
  );
}

/** Monogram inisial mempelai */
export function GadingCrest(props: SvgProps) {
  const a = couple[0].nickname.charAt(0).toUpperCase();
  const b = couple[1].nickname.charAt(0).toUpperCase();
  return (
    <svg viewBox="0 0 200 90" aria-hidden {...props}>
      <circle cx={100} cy={45} r={40} fill="none" className="stroke-accent" strokeWidth={0.8} />
      <circle cx={100} cy={45} r={35} className="fill-surface/70 stroke-accent/60" strokeWidth={0.5} />
      <text x={100} y={56} textAnchor="middle" className="fill-primary font-heading" fontSize={30} letterSpacing={2}>
        {a}
        <tspan className="fill-accent" fontSize={18} dx={3} dy={-4}>
          &amp;
        </tspan>
        <tspan dx={3} dy={4}>
          {b}
        </tspan>
      </text>
      <path d={SPARKLE_PATH} transform="translate(46 22) scale(.5)" className="fill-accent" />
      <path d={SPARKLE_PATH} transform="translate(154 68) scale(.4)" className="fill-accent" />
    </svg>
  );
}
