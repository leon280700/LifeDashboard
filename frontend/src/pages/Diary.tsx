import useDiaryApi from "@/api/useDiaryApi";
import ActivityTiles from "@/components/diary/ActivityTiles";
import DiaryTodayFormular from "@/components/diary/DiaryTodayFormular";
import MoodPicker from "@/components/diary/MoodPicker";
import TileCard from "@/components/diary/TileCard";
import { cardAccents, sectionHeading } from "@/components/diary/accents";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import Headline from "@/components/ui/Headline";
import { today } from "@/helpers/dates";
import {
  isSymptomKey,
  symptoms_mental,
  symptoms_physical,
  type DiaryEntry,
  type DiaryFormValues,
} from "@/types/diary.types";
import { Brain, HeartPulse, PenLine, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Diary() {
  // Zuletzt geladener/gespeicherter Eintrag; dient als Startwert des Formulars.
  // Es wird nur der heutige Eintrag geladen, daher startet jeder neue Tag mit den
  // Default-Aktivitäten (eigene Aktivitäten unter "Sonstige" gelten nur für ihren Tag).
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
        // Symptome, die es in diary.types.ts nicht (mehr) gibt, ignorieren
        setEntry({
          ...loaded,
          symptoms: (loaded.symptoms ?? []).filter(isSymptomKey),
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
        <div className="mt-8 space-y-10 pb-12">
          <div>
            <h2 className={sectionHeading}>Befinden</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <MoodPicker
                title="Körperlich"
                icon={HeartPulse}
                accent={cardAccents.cyan}
                name="saved-mood-physical"
                value={entry.moodPhysical}
                symptoms={symptoms_physical}
                selectedSymptoms={entry.symptoms}
              />
              <MoodPicker
                title="Psychisch"
                icon={Brain}
                accent={cardAccents.indigo}
                name="saved-mood-mental"
                value={entry.moodMental}
                symptoms={symptoms_mental}
                selectedSymptoms={entry.symptoms}
              />
            </div>
          </div>

          <div>
            <h2 className={sectionHeading}>Heute gespeicherte Aktivitäten</h2>
            <ActivityTiles selected={entry.activities} />
          </div>

          {entry.notes && (
            <div>
              <h2 className={sectionHeading}>Notizen</h2>
              <TileCard
                title="Weitere Anmerkungen?"
                icon={PenLine}
                accent={cardAccents.neutral}
              >
                <p className="leading-relaxed whitespace-pre-wrap text-neutral-200">
                  {entry.notes}
                </p>
              </TileCard>
            </div>
          )}

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
    </div>
  );
}
