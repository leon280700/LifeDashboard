import { moodLabels, moods, type Mood } from "@/types/diary.types";
import type { LucideIcon } from "lucide-react";
import type { CardAccent } from "./accents";
import TileCard, { TileBadge } from "./TileCard";

// Mund je Stufe: 0 starkes Runzeln … 2 gerader Strich … 4 lachender, offener Mund
const mouths: Record<Mood, string> = {
  0: "M7.5 17 Q12 12 16.5 17",
  1: "M8 16 Q12 13.5 16 16",
  2: "M8 15.5 H16",
  3: "M8 14.5 Q12 17.5 16 14.5",
  4: "M7.5 13.5 H16.5 Q16.5 18.5 12 18.5 Q7.5 18.5 7.5 13.5 Z",
};

export function MoodFace({
  mood,
  className,
}: {
  mood: Mood;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9.5h.01M15 9.5h.01" strokeWidth={2.5} />
      <path d={mouths[mood]} />
    </svg>
  );
}

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
  accent: CardAccent;
  /** name der Radio-Gruppe, muss pro Seite eindeutig sein */
  name: string;
  value: Mood | null;
  /** Ohne onChange wird das Befinden nur angezeigt. */
  onChange?: (mood: Mood) => void;
};

export default function MoodPicker({
  title,
  icon,
  accent,
  name,
  value,
  onChange,
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
    </TileCard>
  );
}
