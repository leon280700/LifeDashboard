import { Check, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import Button from "./Button";
import ErrorBox from "./ErrorBox";

type Props = {
  title: string;
  /** Kurze Zusammenfassung, z. B. "3 von 5 Zielen erreicht" */
  description?: string;
  /** Zusätzlicher Inhalt unter der Beschreibung, z. B. Badges */
  children?: ReactNode;
  error?: string;
  resetting?: boolean;
  onReset: () => void;
};

/** Bestätigung für ein abgeschicktes FormPanel, mit Möglichkeit zum Zurücksetzen. */
export default function SubmittedPanel({
  title,
  description,
  children,
  error,
  resetting = false,
  onReset,
}: Props) {
  return (
    <section
      role="status"
      className="mt-8 flex flex-col items-center gap-3 rounded-3xl border border-emerald-400/30 bg-linear-to-br from-emerald-500/10 to-neutral-900/50 px-6 py-10 text-center shadow-xl shadow-black/20 backdrop-blur-sm"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40 shadow-lg shadow-emerald-500/20">
        <Check className="size-7" strokeWidth={2.5} aria-hidden />
      </span>
      <h2 className="text-2xl font-medium text-white">{title}</h2>
      {description && <p className="text-neutral-300">{description}</p>}
      {children}
      <Button
        type="button"
        styleType="secondary"
        text="Zurücksetzen"
        icon={RotateCcw}
        onClick={onReset}
        disabled={resetting}
        className="mt-3"
      />
      {error && <ErrorBox message={error} />}
    </section>
  );
}
