interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`w-full max-w-3xl bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.08)] mb-5 p-6 ${className}`}>
      {children}
    </section>
  );
}