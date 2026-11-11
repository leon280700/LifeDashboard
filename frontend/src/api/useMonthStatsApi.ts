import { useEffect, useState } from "react";
import type { DayPercent } from "../types/tracker.types";
import { request } from "./http";

/**
 * Tagesergebnisse (% erreichte Ziele) für einen Monat (month: 1-12).
 * `refreshKey` ändern, um neu zu laden (z. B. nach dem Speichern).
 */
export function useMonthStatsApi(year: number, month: number, refreshKey = 0) {
  const [days, setDays] = useState<DayPercent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    let cancelled = false;
    request<DayPercent[]>(`/api/tracker/month/${key}`)
      .then((data) => {
        if (cancelled) return;
        setDays(data);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Diagramm konnte nicht geladen werden");
      });
    return () => {
      cancelled = true;
    };
  }, [year, month, refreshKey]);

  return { days, error };
}
