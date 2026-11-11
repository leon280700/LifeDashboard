import { useCallback, useState } from "react";
import type { TrackerEntry } from "../types/tracker.types";
import { request } from "./http";

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

  return { error, saveEntry };
}
