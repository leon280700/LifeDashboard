import { useEffect, useState } from "react";
import { useTrackerApi } from "../../api/useTrackerApi";
import { today } from "../../helpers/dates";
import type { Goal } from "../../types/tracker.types";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ErrorBox from "../ui/ErrorBox";

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

  const box = "p-4 rounded border border-neutral-600 bg-neutral-700";

  if (loading || goalsLoading) return <div className={box} aria-busy="true" />;

  if (loadFailed) {
    return (
      <div className={box}>
        <ErrorBox message={shownError} />
      </div>
    );
  }

  if (trackedToday) {
    return (
      <div className={box}>
        <p className="text-white">Heute getrackt</p>
        <Button
          type="button"
          styleType="primary"
          text="Zurücksetzen"
          onClick={handleReset}
        />
        {shownError && <ErrorBox message={shownError} />}
      </div>
    );
  }

  return (
    <div className={box}>
      <h2 className="mb-2 text-2xl font-medium">Heute</h2>
      <form onSubmit={handleSubmit}>
        {goals.length === 0 && (
          <p className="text-white">Noch keine Ziele festgelegt.</p>
        )}
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="contents">
              <input
                id={`goal-${goal.id}`}
                type="checkbox"
                checked={checks[goal.id] ?? false}
                onChange={(e) =>
                  setChecks({ ...checks, [goal.id]: e.target.checked })
                }
              />
              <label htmlFor={`goal-${goal.id}`} className="mr-2 text-white">
                {goal.category}
                {goal.condition && ` (${goal.condition})`}
              </label>
            </div>
          ))}
        </div>
        <Input
          placeholder="Zusätzliche Notizen"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {shownError && <ErrorBox message={shownError} />}
        <Button
          type="submit"
          styleType="primary"
          text="Fertig"
          disabled={saving}
        />
      </form>
    </div>
  );
}
