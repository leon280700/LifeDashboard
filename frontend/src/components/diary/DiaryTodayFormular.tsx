import ActivityTiles from "@/components/diary/ActivityTiles";
import MoodPicker from "@/components/diary/MoodPicker";
import TileCard, { TileBadge } from "@/components/diary/TileCard";
import { cardAccents, sectionHeading } from "@/components/diary/accents";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Input from "@/components/ui/Input";
import {
  MAX_NOTES,
  type DiaryFormValues,
  type Mood,
} from "@/types/diary.types";
import { Brain, Check, HeartPulse, PenLine } from "lucide-react";
import { useState, type SubmitEvent } from "react";

type Props = {
  initialValues: DiaryFormValues;
  saving: boolean;
  error?: string;
  onSubmit: (values: {
    moodPhysical: Mood;
    moodMental: Mood;
    activities: string[];
    notes: string;
  }) => void | Promise<void>;
};

export default function DiaryTodayFormular({
  initialValues,
  saving,
  error,
  onSubmit,
}: Props) {
  const [moodPhysical, setMoodPhysical] = useState(initialValues.moodPhysical);
  const [moodMental, setMoodMental] = useState(initialValues.moodMental);
  const [selectedActivities, setSelectedActivities] = useState(
    initialValues.activities,
  );
  const [notes, setNotes] = useState(initialValues.notes);
  const [validationError, setValidationError] = useState("");

  const toggleActivity = (activity: string) =>
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );

  const addCustomActivity = (activity: string) => {
    const trimmed = activity.trim();
    if (!trimmed) return;
    setSelectedActivities((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed],
    );
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (moodPhysical === null || moodMental === null) {
      setValidationError(
        "Bitte gib dein körperliches und psychisches Befinden an.",
      );
      return;
    }
    setValidationError("");
    onSubmit({
      moodPhysical,
      moodMental,
      activities: selectedActivities,
      notes,
    });
  };

  const shownError = validationError || error;

  return (
    <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
      <div>
        <h2 className={sectionHeading}>Befinden</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MoodPicker
            title="Körperlich"
            icon={HeartPulse}
            accent={cardAccents.cyan}
            name="mood-physical"
            value={moodPhysical}
            onChange={setMoodPhysical}
          />
          <MoodPicker
            title="Psychisch"
            icon={Brain}
            accent={cardAccents.indigo}
            name="mood-mental"
            value={moodMental}
            onChange={setMoodMental}
          />
        </div>
      </div>

      <div>
        <h2 className={sectionHeading}>Aktivitäten</h2>
        <ActivityTiles
          selected={selectedActivities}
          onToggle={toggleActivity}
          onAddCustom={addCustomActivity}
        />
      </div>

      <div>
        <h2 className={sectionHeading}>Notizen</h2>
        <TileCard
          title="Wie war dein Tag?"
          icon={PenLine}
          accent={cardAccents.neutral}
          aside={
            <TileBadge className={cardAccents.neutral.badge}>
              {notes.length}/{MAX_NOTES}
            </TileBadge>
          }
        >
          <Input
            multiline
            rows={5}
            aria-label="Notizen"
            placeholder="Was ist heute passiert, was hat dich beschäftigt?"
            value={notes}
            maxLength={MAX_NOTES}
            className="w-full"
            onChange={(e) => setNotes(e.target.value)}
          />
        </TileCard>
      </div>

      <div className="flex flex-wrap items-center gap-4 pb-12">
        <Button
          type="submit"
          styleType="primary"
          text={saving ? "Speichert…" : "Speichern"}
          icon={Check}
          disabled={saving}
          className=""
        />
        {shownError && <ErrorBox message={shownError} />}
      </div>
    </form>
  );
}
