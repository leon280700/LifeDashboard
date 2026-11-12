import { useState } from "react";
import Button from "../ui/Button";
import {
  GoalTrackerCategories,
  type Goal,
  type GoalForm,
  type GoalInput,
  MAX_GOAL_CONDITION,
} from "../../types/tracker.types";
import Input from "../ui/Input";
import ErrorBox from "../ui/ErrorBox";

// Bekannte Kategorien plus aktive Ziele, die nicht (mehr) in der Liste stehen,
// damit sie beim Speichern nicht unbemerkt beendet werden.
const categoriesFor = (goals: Goal[]) => [
  ...GoalTrackerCategories,
  ...goals
    .map((g) => g.category)
    .filter((c) => !GoalTrackerCategories.includes(c)),
];

const formFromGoals = (goals: Goal[]): GoalForm => {
  const form: GoalForm = Object.fromEntries(
    categoriesFor(goals).map((c) => [c, { selected: false, condition: "" }]),
  );
  for (const g of goals) {
    form[g.category] = { selected: true, condition: g.condition };
  }
  return form;
};

type Props = {
  goals: Goal[];
  loading: boolean;
  loadError: string;
  saveError: string;
  saving: boolean;
  saveGoals: (list: GoalInput[]) => Promise<boolean>;
  onSaved: () => void;
};

export default function Goals({
  goals,
  loading,
  loadError,
  saveError,
  saving,
  saveGoals,
  onSaved,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [edits, setEdits] = useState<GoalForm | null>(null);

  const categories = categoriesFor(goals);
  const form: GoalForm = edits ?? formFromGoals(goals);
  const setForm = setEdits;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selected = Object.entries(form)
      .filter(([, v]) => v.selected)
      .map(([category, v]) => ({ category, condition: v.condition }));
    if (await saveGoals(selected)) {
      setEdits(null);
      setIsOpen(false);
      onSaved();
    }
  };

  return (
    <div className="mb-12 p-4 rounded border border-neutral-600 bg-neutral-700">
      <h2 className="mb-2 text-2xl font-medium">Ziele festlegen</h2>

      {loadError && <ErrorBox message={loadError} />}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        styleType="primary"
        text={isOpen ? "v" : ">"}
        type="button"
        // Ohne geladene Ziele wäre das Formular leer und Speichern würde alle Ziele beenden
        disabled={loading || !!loadError}
      />

      {isOpen && !loading && !loadError && (
        <div className="mt-3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-3">
              {categories.map((item) => (
                <div key={item} className="contents">
                  <input
                    id={`goal-${item}`}
                    type="checkbox"
                    name={item}
                    checked={form[item].selected}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [item]: { ...form[item], selected: e.target.checked },
                      })
                    }
                  />
                  <label htmlFor={`goal-${item}`} className="text-white">
                    {item}
                  </label>
                  <Input
                    placeholder="Bedingungen..."
                    name={`${item}-notes`}
                    className="w-full"
                    maxLength={MAX_GOAL_CONDITION}
                    value={form[item].condition}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [item]: { ...form[item], condition: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
            {saveError && <ErrorBox message={saveError} />}
            <Button
              type="submit"
              styleType="primary"
              text="Speichern"
              disabled={saving}
            />
          </form>
        </div>
      )}
    </div>
  );
}
