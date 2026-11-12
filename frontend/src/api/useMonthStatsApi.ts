import { useEffect, useState } from "react";
import type { DayPercent } from "../types/tracker.types";
import { request } from "./http";

export function useMonthStatsApi(year: number, month: number, refreshKey = 0) {
  const key = `${year}-${String(month).padStart(2, "0")}`;
  const [loaded, setLoaded] = useState<{ key: string; days: DayPercent[] }>({
    key: "",
    days: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    request<DayPercent[]>(`/api/tracker/month/${key}`)
      .then((data) => {
        if (cancelled) return;
        setLoaded({ key, days: data });
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Diagramm konnte nicht geladen werden");
      });
    return () => {
      cancelled = true;
    };
  }, [key, refreshKey]);

  const loading = loaded.key !== key && !error;
  return { days: loaded.key === key ? loaded.days : [], loading, error };
}
