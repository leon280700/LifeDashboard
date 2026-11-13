import useDiaryApi from "@/api/useDiaryApi";
import DiaryEntryView from "@/components/diary/DiaryEntryView";
import ErrorBox from "@/components/ui/ErrorBox";
import IconButton from "@/components/ui/IconButton";
import Modal from "@/components/ui/Modal";
import { addDays, formatLongDate, today } from "@/helpers/dates";
import type { DiaryEntry } from "@/types/diary.types";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  initialDate: string;
  knownEntries: Map<string, DiaryEntry>;
  onClose: () => void;
};

export default function DayDetailModal({
  initialDate,
  knownEntries,
  onClose,
}: Props) {
  const [date, setDate] = useState(initialDate);
  const [fetched, setFetched] = useState<{
    date: string;
    entry: DiaryEntry | null;
  } | null>(null);
  const { getDiaryEntry, error } = useDiaryApi();

  const known = knownEntries.get(date);

  useEffect(() => {
    if (known) return;
    let cancelled = false;
    getDiaryEntry(date).then((entry) => {
      if (!cancelled) setFetched({ date, entry });
    });
    return () => {
      cancelled = true;
    };
  }, [date, known, getDiaryEntry]);

  // undefined = lädt noch, null = kein Eintrag an diesem Tag
  const entry = known ?? (fetched?.date === date ? fetched.entry : undefined);

  const canGoForward = date < today();
  const goBack = () => setDate((d) => addDays(d, -1));
  const goForward = () => {
    if (canGoForward) setDate((d) => addDays(d, 1));
  };

  return (
    <Modal
      title={formatLongDate(date)}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goBack();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goForward();
        }
      }}
      actions={
        <div className="flex items-center gap-2">
          <IconButton
            icon={ChevronLeft}
            label="Vorheriger Tag"
            onClick={goBack}
          />
          <IconButton
            icon={ChevronRight}
            label="Nächster Tag"
            onClick={goForward}
            disabled={!canGoForward}
          />
        </div>
      }
    >
      {entry === undefined ? (
        error ? (
          <ErrorBox message={error} />
        ) : (
          <div aria-busy="true" className="h-64" />
        )
      ) : entry === null ? (
        error ? (
          <ErrorBox message={error} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-neutral-400">
            <CalendarX className="size-10 text-neutral-600" aria-hidden />
            <p>Für diesen Tag gibt es keinen Eintrag.</p>
          </div>
        )
      ) : (
        <DiaryEntryView entry={entry} />
      )}
    </Modal>
  );
}
