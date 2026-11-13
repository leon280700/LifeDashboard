import useDiaryApi from "@/api/useDiaryApi";
import ActivityTiles from "@/components/diary/ActivityTiles";
import DiaryTodayFormular from "@/components/diary/DiaryTodayFormular";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Headline from "@/components/ui/Headline";
import { today } from "@/helpers/dates";
import {
  activities,
  type Activity,
  type DiaryEntry,
  type DiaryFormValues,
} from "@/types/diary.types";
import { useEffect, useState } from "react";

const knownActivities = Object.values(activities) as Activity[];

export default function Diary() {
  // Zuletzt geladener/gespeicherter Eintrag; dient als Startwert des Formulars
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [alreadySavedToday, setAlreadySavedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getDiaryEntry, saveDiaryEntry, deleteDiaryEntry, error, saving } =
    useDiaryApi();

  useEffect(() => {
    let cancelled = false;
    getDiaryEntry(today()).then((loaded) => {
      if (cancelled) return;
      if (loaded) {
        setEntry({
          ...loaded,
          activities: loaded.activities.filter((a) =>
            knownActivities.includes(a),
          ),
        });
        setAlreadySavedToday(true);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getDiaryEntry]);

  const handleSubmit = async (values: Omit<DiaryEntry, "date">) => {
    const newEntry: DiaryEntry = { date: today(), ...values };
    if (await saveDiaryEntry(newEntry)) {
      setEntry(newEntry);
      setAlreadySavedToday(true);
    }
  };

  const handleReset = async () => {
    if (await deleteDiaryEntry(today())) setAlreadySavedToday(false);
  };

  if (loading) return null;

  const initialValues: DiaryFormValues = {
    mood: entry?.mood ?? null,
    activities: entry?.activities ?? [],
    notes: entry?.notes ?? "",
  };

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tagebuch" />
      {alreadySavedToday ? (
        <>
          <h2 className="mt-8 mb-3 text-2xl font-medium text-white">
            Heute gespeicherte Aktivitäten
          </h2>
          <ActivityTiles selected={entry?.activities ?? []} />
          <Button
            type="button"
            styleType="primary"
            text="Zurücksetzen"
            onClick={handleReset}
          />
          {error && <ErrorBox message={error} />}
        </>
      ) : (
        <DiaryTodayFormular
          initialValues={initialValues}
          saving={saving}
          error={error}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
