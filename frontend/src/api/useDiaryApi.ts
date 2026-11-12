import type { DiaryEntry } from "@/types/diary.types";
import { useCallback, useState } from "react";
import { HttpError, request } from "./http";

const messageFor = (e: unknown, fallback: string) =>
  e instanceof HttpError && e.status === 400 ? e.message : fallback;

export default function useDiaryApi() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const getDiaryEntry = useCallback(async (date: string) => {
    setError("");
    try {
      return await request<DiaryEntry>(`/api/diary/${date}`);
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) return null;
      setError("Eintrag konnte nicht geladen werden");
      return null;
    }
  }, []);

  const saveDiaryEntry = useCallback(async (entry: DiaryEntry) => {
    setError("");
    setSaving(true);
    try {
      await request<DiaryEntry>("/api/diary", "PUT", entry);
      return true;
    } catch (e) {
      setError(messageFor(e, "Speichern fehlgeschlagen"));
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteDiaryEntry = useCallback(async (date: string) => {
    setError("");
    try {
      await request(`/api/diary/${date}`, "DELETE");
      return true;
    } catch (e) {
      setError(messageFor(e, "Löschen fehlgeschlagen"));
      return false;
    }
  }, []);

  return {
    error,
    setError,
    saving,
    getDiaryEntry,
    saveDiaryEntry,
    deleteDiaryEntry,
  };
}
