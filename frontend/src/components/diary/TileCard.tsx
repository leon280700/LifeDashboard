import type { LucideIcon } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { CardAccent } from "./accents";

type Props = {
  title: string;
  icon: LucideIcon;
  accent: CardAccent;
  /** Optionaler Inhalt rechts in der Kopfzeile, z. B. ein TileBadge */
  aside?: ReactNode;
  children: ReactNode;
};

export default function TileCard({
  title,
  icon: Icon,
  accent,
  aside,
  children,
}: Props) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-2xl border border-neutral-700/70 bg-linear-to-br ${accent.card} to-neutral-800/40 p-4 sm:p-5`}
    >
      <header className="mb-4 flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${accent.iconBox}`}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <h3 id={headingId} className="text-lg font-semibold text-white">
          {title}
        </h3>
        {aside && <div className="ml-auto">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

export function TileBadge({
  className,
  children,
}: {
  /** Farbklassen, z. B. accent.badge */
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap tabular-nums ${className}`}
    >
      {children}
    </span>
  );
}
