import { useCallback, useState } from "react";
import type { TrackerEntry } from "../types/tracker.types";
import { HttpError, request } from "./http";

/** Speichert die Tageseingabe des Trackers. */
export function useTrackerApi() {
  const [error, setError] = useState("");

  const saveEntry = useCallback(async (entry: TrackerEntry) => {
    setError("");
    try {
      await request("/api/tracker", "POST", entry);
      return true;
    } catch {
      setError("Speichern fehlgeschlagen");
      return false;
    }
  }, []);

  const getTodaysEntry = useCallback(async (date: string) => {
    setError("");
    try {
      return await request<TrackerEntry>(`/api/tracker/${date}`);
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) return null;
      setError("Eintrag konnte nicht geladen werden");
      return null;
    }
  }, []);

  const deleteTodaysEntry = useCallback(async (date: string) => {
    setError("");
    try {
      await request(`/api/tracker/${date}`, "DELETE");
      return true;
    } catch {
      setError("Eintrag konnte nicht gelöscht werden");
      return false;
    }
  }, []);

  return { error, saveEntry, getTodaysEntry, deleteTodaysEntry };
}
