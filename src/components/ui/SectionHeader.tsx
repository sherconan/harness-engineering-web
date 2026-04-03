import { RevealSection } from "../motion/RevealSection";

export function SectionTag({ text }: { text: string }) {
  return (
    <span className="inline-block text-xs font-mono tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-4">
      {text}
    </span>
  );
}

export function SectionHeader({
  tag,
  title,
  subtitle,
}: {
  tag: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <RevealSection className="mb-10 md:mb-14">
      <SectionTag text={tag} />
      <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-text-secondary text-base md:text-lg mt-3 max-w-[65ch]">{subtitle}</p>
      )}
    </RevealSection>
  );
}
