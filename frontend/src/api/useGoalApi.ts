import { useCallback, useEffect, useState } from "react";
import type { Goal, GoalInput } from "../types/tracker.types";
import { request } from "./http";

export function useGoalApi() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    request<Goal[]>("/api/goals")
      .then(setGoals)
      .catch(() => setError("Ziele konnten nicht geladen werden"));
  }, []);

  const saveGoals = useCallback(async (list: GoalInput[]) => {
    setError("");
    try {
      setGoals(await request<Goal[]>("/api/goals", "PUT", { goals: list }));
      return true;
    } catch {
      setError("Speichern fehlgeschlagen");
      return false;
    }
  }, []);

  return { goals, error, saveGoals };
}
