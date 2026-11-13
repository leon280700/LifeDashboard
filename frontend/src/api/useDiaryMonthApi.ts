import type { DiaryEntry } from "@/types/diary.types";
import { useCallback, useEffect, useState } from "react";
import { request } from "./http";
import { normalizeDiaryEntry } from "@/helpers/diary.helpers";

type Result = { key: string; entries: DiaryEntry[]; error: string };

// Alle Tagebuch-Einträge eines Monats (Tage ohne Eintrag fehlen)
export function useDiaryMonthApi(year: number, month: number, refreshKey = 0) {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  const [result, setResult] = useState<Result | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    request<DiaryEntry[]>(`/api/diary/month/${key}`)
      .then((entries) => {
        if (!cancelled) {
          setResult({
            key,
            entries: entries.map(normalizeDiaryEntry),
            error: "",
          });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setResult((prev) => ({
          key,
          // bei einem Reload desselben Monats die bisherigen Daten behalten
          entries: prev?.key === key ? prev.entries : [],
          error: "Verlauf konnte nicht geladen werden",
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [key, refreshKey, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  const current = result?.key === key ? result : null;
  return {
    entries: current?.entries ?? [],
    error: current?.error ?? "",
    loading: current === null,
    retry,
  };
}
