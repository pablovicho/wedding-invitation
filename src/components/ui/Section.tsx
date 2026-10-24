export default function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-4 overflow-hidden px-6 py-20 ${className}`}>
      {children}
    </section>
  );
}
