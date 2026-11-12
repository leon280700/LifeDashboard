import useDiaryApi from "@/api/useDiaryApi";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Headline from "@/components/ui/Headline";
import Input from "@/components/ui/Input";
import { today } from "@/helpers/dates";
import {
  activities,
  moods,
  type Activity,
  type DiaryEntry,
} from "@/types/diary.types";
import { useEffect, useState, type SubmitEvent } from "react";

const knownActivities = Object.values(activities) as Activity[];

export default function Diary() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState("");
  const [alreadySavedToday, setAlreadySavedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    getDiaryEntry,
    saveDiaryEntry,
    deleteDiaryEntry,
    error,
    setError,
    saving,
  } = useDiaryApi();

  useEffect(() => {
    let cancelled = false;
    getDiaryEntry(today()).then((entry) => {
      if (cancelled) return;
      if (entry) {
        setAlreadySavedToday(true);
        setSelectedMood(entry.mood);
        setSelectedActivities(
          entry.activities.filter((a) => knownActivities.includes(a)),
        );
        setNotes(entry.notes);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getDiaryEntry]);

  const toggleActivity = (activity: Activity) =>
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedMood === null) {
      setError("Bitte wähle eine Stimmung aus.");
      return;
    }
    const entry: DiaryEntry = {
      date: today(),
      mood: selectedMood,
      activities: selectedActivities,
      notes,
    };
    const success = await saveDiaryEntry(entry);

    if (success) {
      setAlreadySavedToday(true);
    }
  };

  const handleReset = async () => {
    const deletedEntry = await deleteDiaryEntry(today());
    if (deletedEntry) {
      setAlreadySavedToday(false);
    }
  };

  if (loading) return null;

  if (alreadySavedToday) {
    return (
      <div className="mx-auto mt-12 max-w-6xl px-4">
        <Headline children="Tagebuch" />
        <p className="mt-4 text-white">Heute bereits gespeichert</p>
        <Button
          type="button"
          styleType="primary"
          text="Zurücksetzen"
          onClick={handleReset}
        />
        {error && <ErrorBox message={error} />}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tagebuch" />
      <form className="mt-4" onSubmit={handleSubmit}>
        {moods.map((mood) => (
          <label key={mood} className="mr-4 cursor-pointer text-3xl">
            <input
              type="radio"
              name="mood"
              checked={selectedMood === mood}
              onChange={() => setSelectedMood(mood)}
            />
            {mood}
          </label>
        ))}
        {Object.entries(activities).map(([key, activity]) => (
          <div key={key} className="flex items-center gap-2">
            <input
              id={key}
              type="checkbox"
              checked={selectedActivities.includes(activity)}
              onChange={() => toggleActivity(activity)}
            />
            <label htmlFor={key} className="text-white">
              {activity}
            </label>
          </div>
        ))}

        <Input
          placeholder="Weitere Notizen..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          type="submit"
          styleType="primary"
          text="Speichern"
          disabled={saving}
        />
      </form>
      {error && <ErrorBox message={error} />}
    </div>
  );
}
