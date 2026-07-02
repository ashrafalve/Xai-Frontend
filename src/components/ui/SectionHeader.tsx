interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className ?? ""}`}>
      <span className="text-xs font-medium text-accent2 uppercase tracking-wider">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-4xl font-semibold text-text sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-xl text-lg text-text2">
          {subtitle}
        </p>
      )}
    </div>
  );
}