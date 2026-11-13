import type { Mood } from "@/types/diary.types";

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
