import type { SymptomKey } from "@/types/diary.types";
import Chip from "@/components/ui/Chip";
import type { ChipCardAccent } from "./accents";

export default function SymptomChips({
  title,
  accent,
  symptoms,
  selected,
  onToggle,
}: {
  title: string;
  accent: ChipCardAccent;
  symptoms: Partial<Record<SymptomKey, string>>;
  selected: SymptomKey[];
  onToggle?: (symptom: SymptomKey) => void;
}) {
  const entries = (Object.entries(symptoms) as [SymptomKey, string][]).filter(
    ([key]) => onToggle || selected.includes(key),
  );
  if (entries.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <p className="mb-2.5 text-xs font-medium tracking-wide text-neutral-400 uppercase">
        Symptome
        {onToggle && (
          <span className="font-normal tracking-normal text-neutral-500 normal-case">
            {" "}
            · optional
          </span>
        )}
      </p>
      <div
        role="group"
        aria-label={`Symptome ${title}`}
        className="flex flex-wrap gap-2"
      >
        {entries.map(([key, label]) => (
          <Chip
            key={key}
            text={label}
            selected={selected.includes(key)}
            onClick={onToggle && (() => onToggle(key))}
            selectedClassName={accent.chip}
          />
        ))}
      </div>
    </div>
  );
}
