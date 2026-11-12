import type { DiaryEntry } from "@/types/diary.types";
import { useCallback, useState } from "react";
import { request } from "./http";

export default function useDiaryApi() {
  const [error, setError] = useState("");

  const saveDiaryEntry = useCallback(async (entry: DiaryEntry) => {
    setError("");
    try {
      await request<DiaryEntry>("/api/diary", "PUT", entry);
      return true;
    } catch {
      setError("Speichern fehlgeschlagen");
      return false;
    }
  }, []);

  const deleteDiaryEntry = useCallback(async (date: string) => {
    setError("");
    try {
      const deletedEntry = await request(`/api/diary/${date}`, "DELETE");
      return deletedEntry;
    } catch {
      setError("Löschen fehlgeschlagen");
      return null;
    }
  }, []);

  return { error, saveDiaryEntry, deleteDiaryEntry };
}
