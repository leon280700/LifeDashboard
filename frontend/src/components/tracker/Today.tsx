import { useEffect, useState } from "react";
import { useTrackerApi } from "../../api/useTrackerApi";
import { today } from "../../helpers/dates";
import type { Goal } from "../../types/tracker.types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ErrorBox from "../ui/ErrorBox";
import { Check, ListChecks, PenLine, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import TileCard, { TileBadge } from "../diary/TileCard";
import {
  cardAccents,
  sectionHeading,
  tileAccents,
  tileBase,
} from "../diary/accents";

type Props = {
  goals: Goal[];
  goalsLoading: boolean;
  goalsError: string;
  onSaved?: () => void;
};

export default function Today({
  goals,
  goalsLoading,
  goalsError,
  onSaved,
}: Props) {
  const [trackedToday, setTrackedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const { error, saving, saveEntry, getTodaysEntry, deleteTodaysEntry } =
    useTrackerApi();
  const shownError = error || goalsError;

  useEffect(() => {
    let cancelled = false;
    getTodaysEntry(today()).then(({ entry, failed }) => {
      if (cancelled) return;
      if (entry) {
        setChecks(entry.checks);
        setNotes(entry.notes);
        setTrackedToday(true);
      }
      setLoadFailed(failed);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getTodaysEntry]);

  const handleReset = async () => {
    if (await deleteTodaysEntry(today())) {
      setTrackedToday(false);
      onSaved?.();
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await saveEntry({ date: today(), checks, notes })) {
      setTrackedToday(true);
      onSaved?.();
    }
  };

  const accent = tileAccents.emerald;

  const section = (children: ReactNode) => (
    <section className="mt-8">
      <h2 className={sectionHeading}>Heute</h2>
      {children}
    </section>
  );

  if (loading || goalsLoading)
    return section(<div aria-busy="true" className="h-24" />);

  if (loadFailed) {
    return section(<ErrorBox message={shownError} />);
  }

  if (trackedToday) {
    return section(
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-white">Heute getrackt!</p>
        <Button
          type="button"
          styleType="secondary"
          text="Zurücksetzen"
          icon={RotateCcw}
          onClick={handleReset}
          className=""
        />
        {shownError && <ErrorBox message={shownError} />}
      </div>,
    );
  }

  const doneCount = goals.filter((g) => checks[g.id]).length;

  return section(
    <form className="space-y-6" onSubmit={handleSubmit}>
      <TileCard
        title="Ziele"
        icon={ListChecks}
        accent={cardAccents.cyan}
        aside={
          goals.length > 0 && (
            <TileBadge className={cardAccents.cyan.badge}>
              {doneCount}/{goals.length}
            </TileBadge>
          )
        }
      >
        {goals.length === 0 && (
          <p className="text-neutral-400">Noch keine Ziele festgelegt.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const checked = checks[goal.id] ?? false;
            return (
              <button
                key={goal.id}
                type="button"
                aria-pressed={checked}
                onClick={() => setChecks({ ...checks, [goal.id]: !checked })}
                className={`${tileBase} min-h-20 cursor-pointer justify-between gap-2 transition duration-150 outline-none focus-visible:ring-4 focus-visible:ring-white/20 ${
                  checked
                    ? accent.selected
                    : `border-neutral-700 bg-neutral-800/60 text-neutral-200 ${accent.hover}`
                }`}
              >
                <span className="font-medium">{goal.category}</span>
                {goal.condition && (
                  <span className="text-neutral-400">{goal.condition}</span>
                )}
                {checked && (
                  <span
                    className={`absolute top-2 right-2 flex size-5 items-center justify-center rounded-full ${accent.check}`}
                  >
                    <Check className="size-3.5" aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </TileCard>

      <TileCard
        title="Notizen"
        icon={PenLine}
        accent={cardAccents.neutral}
      >
        <Input
          multiline
          rows={3}
          aria-label="Notizen"
          placeholder="Zusätzliche Notizen"
          name="notes"
          value={notes}
          className="w-full"
          onChange={(e) => setNotes(e.target.value)}
        />
      </TileCard>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          styleType="primary"
          text={saving ? "Speichert…" : "Fertig"}
          icon={Check}
          disabled={saving}
          className=""
        />
        {shownError && <ErrorBox message={shownError} />}
      </div>
    </form>,
  );
}
