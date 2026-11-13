import useDiaryApi from "@/api/useDiaryApi";
import DiaryEntryView from "@/components/diary/DiaryEntryView";
import DiaryTodayFormular from "@/components/diary/DiaryTodayFormular";
import MoodChart from "@/components/diary/MoodChart";
import { sectionHeading } from "@/components/diary/accents";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Headline from "@/components/ui/Headline";
import { today } from "@/helpers/dates";
import type { DiaryEntry, DiaryFormValues } from "@/types/diary.types";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Diary() {
  // Zuletzt geladener/gespeicherter Eintrag; dient als Startwert des Formulars.
  // Es wird nur der heutige Eintrag geladen, daher startet jeder neue Tag mit den
  // Default-Aktivitäten (eigene Aktivitäten unter "Sonstige" gelten nur für ihren Tag).
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [alreadySavedToday, setAlreadySavedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entryVersion, setEntryVersion] = useState(0);
  const { getDiaryEntry, saveDiaryEntry, deleteDiaryEntry, error, saving } =
    useDiaryApi();

  useEffect(() => {
    let cancelled = false;
    getDiaryEntry(today()).then((loaded) => {
      if (cancelled) return;
      if (loaded) {
        setEntry(loaded);
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
      setEntryVersion((v) => v + 1);
    }
  };

  const handleReset = async () => {
    if (await deleteDiaryEntry(today())) {
      setAlreadySavedToday(false);
      setEntryVersion((v) => v + 1);
    }
  };

  if (loading) return null;

  const initialValues: DiaryFormValues = {
    moodPhysical: entry?.moodPhysical ?? null,
    moodMental: entry?.moodMental ?? null,
    symptoms: entry?.symptoms ?? [],
    activities: entry?.activities ?? [],
    notes: entry?.notes ?? "",
  };

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tagebuch" />
      {alreadySavedToday && entry ? (
        <div className="mt-8 space-y-10">
          <DiaryEntryView
            entry={entry}
            activitiesTitle="Heute gespeicherte Aktivitäten"
          />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              styleType="secondary"
              text="Zurücksetzen"
              icon={RotateCcw}
              onClick={handleReset}
              className=""
            />
            {error && <ErrorBox message={error} />}
          </div>
        </div>
      ) : (
        <DiaryTodayFormular
          initialValues={initialValues}
          saving={saving}
          error={error}
          onSubmit={handleSubmit}
        />
      )}

      <section className="mt-12 pb-12">
        <h2 className={sectionHeading}>Verlauf</h2>
        <MoodChart refreshKey={entryVersion} />
      </section>
    </div>
  );
}
