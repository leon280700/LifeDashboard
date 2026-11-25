import { Check } from "lucide-react";
import { useId, type ReactNode, type SubmitEvent } from "react";
import Button from "./Button";
import ErrorBox from "./ErrorBox";

type Props = {
  title: string;
  /** Zusatzzeile unter dem Titel, z. B. das heutige Datum */
  subtitle?: string;
  submitText: string;
  saving?: boolean;
  error?: string;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

/**
 * Rahmen um alle Karten eines Formulars. Kopfzeile und Fußzeile mit dem
 * Speichern-Button zeigen, dass die Karten dazwischen zusammengehören.
 */
export default function FormPanel({
  title,
  subtitle,
  submitText,
  saving = false,
  error,
  onSubmit,
  children,
}: Props) {
  const titleId = useId();

  return (
    <form
      aria-labelledby={titleId}
      onSubmit={onSubmit}
      className="mt-8 overflow-hidden rounded-3xl border border-neutral-700/70 bg-neutral-900/50 shadow-xl shadow-black/20 backdrop-blur-sm"
    >
      <header className="border-b border-neutral-800 bg-neutral-900/60 px-4 py-4 sm:px-6">
        <h2 id={titleId} className="text-2xl font-medium text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-neutral-400">{subtitle}</p>
        )}
      </header>

      <div className="space-y-8 px-4 py-6 sm:px-6">{children}</div>

      <footer className="flex flex-wrap items-center gap-4 border-t border-neutral-800 bg-neutral-900/60 px-4 py-4 sm:px-6">
        <Button
          type="submit"
          styleType="primary"
          text={saving ? "Speichert…" : submitText}
          icon={Check}
          disabled={saving}
          className=""
        />
        {error && <ErrorBox message={error} />}
      </footer>
    </form>
  );
}
