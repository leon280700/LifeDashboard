import { useCallback, useState } from "react";
import type {
  TrackerEntry,
  TrackerEntryResponse,
} from "../types/tracker.types";
import { HttpError, errorMessage, request } from "./http";

export function useTrackerApi() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const saveEntry = useCallback(async (entry: TrackerEntry) => {
    setError("");
    setSaving(true);
    try {
      await request("/api/tracker", "POST", entry);
      return true;
    } catch (e) {
      setError(errorMessage(e, "Speichern fehlgeschlagen"));
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const getTodaysEntry = useCallback(async (date: string) => {
    setError("");
    try {
      const res = await request<TrackerEntryResponse>(`/api/tracker/${date}`);
      const entry: TrackerEntry = {
        date: res.date,
        checks: Object.fromEntries(
          res.checks.map((c) => [c.goalId, c.achieved]),
        ),
        notes: res.notes,
      };
      return { entry, failed: false };
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) {
        return { entry: null, failed: false };
      }
      setError("Eintrag konnte nicht geladen werden");
      return { entry: null, failed: true };
    }
  }, []);

  const deleteTodaysEntry = useCallback(async (date: string) => {
    setError("");
    try {
      await request(`/api/tracker/${date}`, "DELETE");
      return true;
    } catch (e) {
      setError(errorMessage(e, "Eintrag konnte nicht gelöscht werden"));
      return false;
    }
  }, []);

  return { error, saving, getTodaysEntry, saveEntry, deleteTodaysEntry };
}
