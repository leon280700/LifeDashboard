import ActivityTiles from "@/components/diary/ActivityTiles";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Input from "@/components/ui/Input";
import {
  moods,
  type Activity,
  type DiaryFormValues,
} from "@/types/diary.types";
import { useState, type SubmitEvent } from "react";

type Props = {
  initialValues: DiaryFormValues;
  saving: boolean;
  error?: string;
  onSubmit: (values: {
    mood: number;
    activities: Activity[];
    notes: string;
  }) => void | Promise<void>;
};

export default function DiaryTodayFormular({
  initialValues,
  saving,
  error,
  onSubmit,
}: Props) {
  const [mood, setMood] = useState(initialValues.mood);
  const [selectedActivities, setSelectedActivities] = useState(
    initialValues.activities,
  );
  const [notes, setNotes] = useState(initialValues.notes);
  const [validationError, setValidationError] = useState("");

  const toggleActivity = (activity: Activity) =>
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mood === null) {
      setValidationError("Bitte wähle eine Stimmung aus.");
      return;
    }
    setValidationError("");
    onSubmit({ mood, activities: selectedActivities, notes });
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      {moods.map((m) => (
        <label key={m} className="mr-4 cursor-pointer text-3xl">
          <input
            type="radio"
            name="mood"
            checked={mood === m}
            onChange={() => setMood(m)}
          />
          {m}
        </label>
      ))}
      <h2 className="mt-8 mb-3 text-2xl font-medium text-white">
        Aktivitäten
      </h2>
      <div className="mb-4">
        <ActivityTiles
          selected={selectedActivities}
          onToggle={toggleActivity}
        />
      </div>

      <Input
        placeholder="Weitere Notizen..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {(validationError || error) && (
        <ErrorBox message={validationError || error!} />
      )}
      <Button
        type="submit"
        styleType="primary"
        text="Speichern"
        disabled={saving}
      />
    </form>
  );
}
