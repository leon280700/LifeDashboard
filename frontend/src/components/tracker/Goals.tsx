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
import Modal from "../ui/Modal";
import { Check, Target } from "lucide-react";
import Chip from "../ui/Chip";

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

  const close = () => {
    setEdits(null);
    setIsOpen(false);
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <Button
        onClick={() => setIsOpen(true)}
        styleType="secondary"
        text="Ziele festlegen"
        icon={Target}
        type="button"
        className=""
        // Ohne geladene Ziele wäre das Formular leer und Speichern würde alle Ziele beenden
        disabled={loading || !!loadError}
      />
      {loadError && <ErrorBox message={loadError} />}

      {isOpen && !loading && !loadError && (
        <Modal title="Ziele festlegen" onClose={close}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3">
              {categories.map((item) => (
                <div key={item} className="contents">
                  <Chip
                    text={item}
                    selected={form[item].selected}
                    onClick={() =>
                      setForm({
                        ...form,
                        [item]: {
                          ...form[item],
                          selected: !form[item].selected,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Bedingungen..."
                    name={`${item}-notes`}
                    className="w-full"
                    maxLength={MAX_GOAL_CONDITION}
                    value={form[item].condition}
                    disabled={!form[item].selected}
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
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                styleType="primary"
                text={saving ? "Speichert…" : "Speichern"}
                icon={Check}
                disabled={saving}
                className=""
              />
              {saveError && <ErrorBox message={saveError} />}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
