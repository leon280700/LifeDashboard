import { useState } from "react";
import Button from "../ui/Button";
import { useGoalApi } from "../../api/useGoalApi";
import {
  GoalTrackerCategories,
  type Goal,
  type GoalForm,
} from "../../types/tracker.types";
import Input from "../ui/Input";

const emptyForm = (): GoalForm =>
  Object.fromEntries(
    GoalTrackerCategories.map((c) => [c, { selected: false, condition: "" }]),
  );

const formFromGoals = (goals: Goal[]): GoalForm => {
  const form = emptyForm();
  for (const g of goals) {
    if (g.category in form)
      form[g.category] = { selected: true, condition: g.condition };
  }
  return form;
};

export default function Goals({ onSaved }: { onSaved: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [edits, setEdits] = useState<GoalForm | null>(null);
  const { goals, error, saveGoals } = useGoalApi();

  const form: GoalForm = edits ?? formFromGoals(goals);
  const setForm = setEdits;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selected = Object.entries(form)
      .filter(([, v]) => v.selected)
      .map(([category, v]) => ({ category, condition: v.condition }));
    if (await saveGoals(selected)) {
      setEdits(null);
      onSaved();
    }
  };

  return (
    <div className="mb-12 p-4 rounded border border-neutral-600 bg-neutral-700">
      <h2 className="mb-2 text-2xl font-medium">Ziele festlegen</h2>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        styleType="primary"
        text={isOpen ? "v" : ">"}
        type="button"
      />

      {isOpen && (
        <div className="mt-3">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-4 gap-y-3">
              {GoalTrackerCategories.map((item) => (
                <div key={item} className="contents">
                  <input
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
                  <label className="text-white">{item}</label>
                  <Input
                    placeholder="Bedingungen..."
                    name={`${item}-notes`}
                    className="w-full"
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
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" styleType="primary" text="Speichern" />
          </form>
        </div>
      )}
    </div>
  );
}
