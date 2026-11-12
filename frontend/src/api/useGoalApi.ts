import { useCallback, useEffect, useState } from "react";
import type { Goal, GoalInput } from "../types/tracker.types";
import { errorMessage, request } from "./http";

/** Aktive Ziele. Einmal pro Seite verwenden und per Props weitergeben. */
export function useGoalApi() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    request<Goal[]>("/api/goals")
      .then((data) => {
        if (cancelled) return;
        setGoals(data);
        setError("");
      })
      .catch(() => {
        if (!cancelled) setError("Ziele konnten nicht geladen werden");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveGoals = useCallback(async (list: GoalInput[]) => {
    setError("");
    setSaving(true);
    try {
      setGoals(await request<Goal[]>("/api/goals", "PUT", { goals: list }));
      return true;
    } catch (e) {
      setError(errorMessage(e, "Speichern fehlgeschlagen"));
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { goals, loading, error, saving, saveGoals };
}
