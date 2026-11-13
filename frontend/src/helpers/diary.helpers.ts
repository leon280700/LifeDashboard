import { type DiaryEntry, isSymptomKey } from "@/types/diary.types";

// Symptome, die es in diary.types.ts nicht (mehr) gibt, ignorieren
export const normalizeDiaryEntry = (entry: DiaryEntry): DiaryEntry => ({
  ...entry,
  symptoms: (entry.symptoms ?? []).filter(isSymptomKey),
});
