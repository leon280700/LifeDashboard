import { useCallback, useEffect, useState } from "react";
import type { DayPercent } from "../types/tracker.types";
import { request } from "./http";

type Result = { key: string; days: DayPercent[]; error: string };

export function useMonthStatsApi(year: number, month: number, refreshKey = 0) {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  const [result, setResult] = useState<Result | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    request<DayPercent[]>(`/api/tracker/month/${key}`)
      .then((days) => {
        if (!cancelled) setResult({ key, days, error: "" });
      })
      .catch(() => {
        if (cancelled) return;
        setResult((prev) => ({
          key,
          // bei einem Reload desselben Monats die bisherigen Daten behalten
          days: prev?.key === key ? prev.days : [],
          error: "Diagramm konnte nicht geladen werden",
        }));
      });
    return () => {
      cancelled = true;
    };
  }, [key, refreshKey, retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  const current = result?.key === key ? result : null;
  return {
    days: current?.days ?? [],
    error: current?.error ?? "",
    loading: current === null,
    retry,
  };
}
