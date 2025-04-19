interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-black/[0.08] uppercase text-text-primary">
      {title}
    </h2>
  );
}