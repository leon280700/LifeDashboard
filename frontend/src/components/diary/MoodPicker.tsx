import {
  moodLabels,
  moods,
  type Mood,
  type SymptomKey,
} from "@/types/diary.types";
import { type LucideIcon } from "lucide-react";
import type { ChipCardAccent } from "./accents";
import TileCard, { TileBadge } from "./TileCard";
import SymptomChips from "./SyptomChips";
import { MoodFace } from "./MoodFace";

// Farbe je Stufe, von Rot (0) bis Grün (4)
const moodStyles: Record<Mood, { selected: string; badge: string }> = {
  0: {
    selected:
      "border-red-400/70 bg-red-500/15 text-red-300 shadow-lg shadow-red-500/10",
    badge: "bg-red-500/15 text-red-300",
  },
  1: {
    selected:
      "border-orange-400/70 bg-orange-500/15 text-orange-300 shadow-lg shadow-orange-500/10",
    badge: "bg-orange-500/15 text-orange-300",
  },
  2: {
    selected:
      "border-yellow-400/70 bg-yellow-500/15 text-yellow-200 shadow-lg shadow-yellow-500/10",
    badge: "bg-yellow-500/15 text-yellow-200",
  },
  3: {
    selected:
      "border-lime-400/70 bg-lime-500/15 text-lime-300 shadow-lg shadow-lime-500/10",
    badge: "bg-lime-500/15 text-lime-300",
  },
  4: {
    selected:
      "border-emerald-400/70 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
};

type Props = {
  title: string;
  icon: LucideIcon;
  accent: ChipCardAccent;
  /** name der Radio-Gruppe, muss pro Seite eindeutig sein */
  name: string;
  value: Mood | null;
  /** Ohne onChange wird das Befinden nur angezeigt. */
  onChange?: (mood: Mood) => void;
  /** Auswählbare Symptome dieser Karte (Key → Text), z. B. symptoms_physical */
  symptoms: Partial<Record<SymptomKey, string>>;
  selectedSymptoms: SymptomKey[];
  onToggleSymptom?: (symptom: SymptomKey) => void;
};

export default function MoodPicker({
  title,
  icon,
  accent,
  name,
  value,
  onChange,
  symptoms,
  selectedSymptoms,
  onToggleSymptom,
}: Props) {
  const readOnly = !onChange;

  const badge =
    value !== null ? (
      <TileBadge className={moodStyles[value].badge}>
        {moodLabels[value]}
      </TileBadge>
    ) : readOnly ? (
      <TileBadge className={accent.badge}>Nicht erfasst</TileBadge>
    ) : null;

  return (
    <TileCard title={title} icon={icon} accent={accent} aside={badge}>
      <div
        role="radiogroup"
        aria-label={title}
        className="grid grid-cols-5 gap-2"
      >
        {moods.map((mood) => {
          const checked = value === mood;
          const state = checked
            ? moodStyles[mood].selected
            : readOnly
              ? "border-neutral-800 bg-neutral-800/40 text-neutral-600"
              : "cursor-pointer border-neutral-700 bg-neutral-800/70 text-neutral-400 hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-200 active:scale-95";

          return (
            <label
              key={mood}
              title={moodLabels[mood]}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-3 transition duration-150 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-white/60 ${state}`}
            >
              <input
                type="radio"
                name={name}
                value={mood}
                checked={checked}
                disabled={readOnly}
                onChange={() => onChange?.(mood)}
                className="sr-only"
              />
              <MoodFace
                mood={mood}
                className={`size-8 transition duration-150 sm:size-9 ${checked ? "scale-110" : ""}`}
              />
              <span className="text-xs font-medium tabular-nums" aria-hidden>
                {mood}
              </span>
              <span className="sr-only">{moodLabels[mood]}</span>
            </label>
          );
        })}
      </div>

      <SymptomChips
        title={title}
        accent={accent}
        symptoms={symptoms}
        selected={selectedSymptoms}
        onToggle={readOnly ? undefined : onToggleSymptom}
      />
    </TileCard>
  );
}
