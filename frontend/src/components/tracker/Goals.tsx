import { useState } from "react";
import Button from "../ui/Button";
import { type Goal, type GoalInput } from "../../types/tracker.types";
import ErrorBox from "../ui/ErrorBox";
import { Target } from "lucide-react";
import GoalsSettingModal from "./GoalsSettingModal";

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

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <Button
        onClick={() => setIsOpen(true)}
        styleType="primary"
        text="Ziele festlegen"
        icon={Target}
        type="button"
        className=""
        disabled={loading || !!loadError}
      />

      {loadError && <ErrorBox message={loadError} />}

      {isOpen && !loading && !loadError && (
        <GoalsSettingModal
          goals={goals}
          saveError={saveError}
          saving={saving}
          saveGoals={saveGoals}
          onSaved={onSaved}
          onClose={() => setIsOpen(false)}
          loading={false}
          loadError={loadError}
        />
      )}
    </div>
  );
}
