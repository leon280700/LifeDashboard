import ActivityTiles from "@/components/diary/ActivityTiles";
import MoodPicker from "@/components/diary/MoodPicker";
import { cardAccents, sectionHeading } from "@/components/diary/accents";
import NotesCard from "@/components/ui/NotesCard";
import FormPanel from "@/components/ui/FormPanel";
import { formatLongDate, today } from "@/helpers/dates";
import {
  symptoms_mental,
  symptoms_physical,
  type DiaryFormValues,
  type Mood,
  type SymptomKey,
} from "@/types/diary.types";
import { Brain, HeartPulse } from "lucide-react";
import { useState, type SubmitEvent } from "react";

type Props = {
  initialValues: DiaryFormValues;
  saving: boolean;
  error?: string;
  onSubmit: (values: {
    moodPhysical: Mood;
    moodMental: Mood;
    symptoms: SymptomKey[];
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
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    initialValues.symptoms,
  );
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

  const toggleSymptom = (symptom: SymptomKey) =>
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
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
      symptoms: selectedSymptoms,
      activities: selectedActivities,
      notes,
    });
  };

  const shownError = validationError || error;

  return (
    <FormPanel
      title="Heutiger Eintrag"
      subtitle={formatLongDate(today())}
      submitText="Speichern"
      saving={saving}
      error={shownError}
      onSubmit={handleSubmit}
    >
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
            symptoms={symptoms_physical}
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={toggleSymptom}
          />
          <MoodPicker
            title="Psychisch"
            icon={Brain}
            accent={cardAccents.indigo}
            name="mood-mental"
            value={moodMental}
            onChange={setMoodMental}
            symptoms={symptoms_mental}
            selectedSymptoms={selectedSymptoms}
            onToggleSymptom={toggleSymptom}
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

      <NotesCard notes={notes} setNotes={setNotes} />
    </FormPanel>
  );
}
