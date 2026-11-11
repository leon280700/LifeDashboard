import { useState } from "react";
import { useGoalApi } from "../../api/useGoalApi";
import { useTrackerApi } from "../../api/useTrackerApi";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Today() {
  const [trackedToday, setTrackedToday] = useState(false);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const { goals, error: goalsError } = useGoalApi();
  const { error: saveError, saveEntry } = useTrackerApi();
  const error = goalsError || saveError;

  if (trackedToday) {
    return (
      <div className="pb-2 bg-secondary border rounded mb-5">
        <p className="text-white">Heute getrackt</p>
        <Button
          type="button"
          styleType="primary"
          text="Zurücksetzen"
          onClick={() => setTrackedToday(false)}
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const date = new Date().toLocaleDateString("sv"); // YYYY-MM-DD (lokal)
    if (await saveEntry({ date, checks, notes })) setTrackedToday(true);
  };

  return (
    <div className="p-4 bg-secondary border rounded mb-5">
      <form onSubmit={handleSubmit}>
        {goals.length === 0 && (
          <p className="text-white">Noch keine Ziele festgelegt.</p>
        )}
        {goals.map((goal) => (
          <div key={goal.id} className="mb-2">
            <label className="text-white mr-2">
              {goal.category}
              {goal.condition && ` (${goal.condition})`}
            </label>
            <input
              type="checkbox"
              checked={checks[goal.id] ?? false}
              onChange={(e) =>
                setChecks({ ...checks, [goal.id]: e.target.checked })
              }
            />
          </div>
        ))}
        <Input
          placeholder="Zusätzliche Notizen"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {error && <p className="text-danger">{error}</p>}
        <Button type="submit" styleType="primary" text="Fertig" />
      </form>
    </div>
  );
}
