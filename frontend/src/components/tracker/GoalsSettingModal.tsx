import {
  GoalTrackerCategories,
  MAX_GOAL_CONDITION,
  type Goal,
  type GoalForm,
  type GoalInput,
} from "@/types/tracker.types";
import { Check } from "lucide-react";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import ErrorBox from "../ui/ErrorBox";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useState } from "react";

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
  saveError: string;
  saving: boolean;
  saveGoals: (list: GoalInput[]) => Promise<boolean>;
  onSaved: () => void;
  onClose: () => void;
};

export default function GoalsSettingModal({
  goals,
  saveGoals,
  saveError,
  saving,
  onSaved,
  onClose,
}: Props) {
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
      onClose();
      onSaved();
    }
  };

  const close = () => {
    setEdits(null);
    onClose();
  };
  return (
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
  );
}
