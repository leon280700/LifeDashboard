import { useEffect, useState } from "react";
import { useGoalApi } from "../../api/useGoalApi";
import { useTrackerApi } from "../../api/useTrackerApi";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Today({ onSaved }: { onSaved?: () => void }) {
  const [trackedToday, setTrackedToday] = useState(false);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const { goals, error: goalsError } = useGoalApi();
  const {
    error: saveError,
    saveEntry,
    getTodaysEntry,
    deleteTodaysEntry,
  } = useTrackerApi();
  const error = goalsError || saveError;

  useEffect(() => {
    const date = new Date().toLocaleDateString("sv");
    const loadTodaysEntry = async () => {
      const entry = await getTodaysEntry(date);
      if (entry) {
        setChecks(entry.checks);
        setNotes(entry.notes);
        setTrackedToday(true);
      }
    };
    loadTodaysEntry();
  }, [getTodaysEntry]);

  const handleReset = async () => {
    const date = new Date().toLocaleDateString("sv");
    const removedEntry = await deleteTodaysEntry(date);
    if (removedEntry) {
      setChecks({});
      setNotes("");
      setTrackedToday(false);
      onSaved?.();
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString("sv"); // YYYY-MM-DD (lokal)
    if (await saveEntry({ date, checks, notes })) {
      setTrackedToday(true);
      onSaved?.();
    }
  };

  if (trackedToday) {
    return (
      <div className="p-4 rounded border border-neutral-600 bg-neutral-700">
        <p className="text-white">Heute getrackt</p>
        <Button
          type="button"
          styleType="primary"
          text="Zurücksetzen"
          onClick={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="p-4 rounded border border-neutral-600 bg-neutral-700">
      <h2 className="mb-2 text-2xl font-medium">Heute</h2>
      <form onSubmit={handleSubmit}>
        {goals.length === 0 && (
          <p className="text-white">Noch keine Ziele festgelegt.</p>
        )}
        <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="contents">
              <input
                type="checkbox"
                checked={checks[goal.id] ?? false}
                onChange={(e) =>
                  setChecks({ ...checks, [goal.id]: e.target.checked })
                }
              />
              <label className="mr-2 text-white">{goal.category}</label>
              <label className="mr-2 text-white">
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
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" styleType="primary" text="Fertig" />
      </form>
    </div>
  );
}
