import { Divider } from '@/components/ornaments';
import Reveal from './Reveal';

export default function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-8 text-center">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h2 className="font-heading text-[2rem] font-medium leading-tight text-primary">{title}</h2>
      <Divider className="mx-auto mt-3 w-44" />
      {children && <div className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">{children}</div>}
    </Reveal>
  );
}
