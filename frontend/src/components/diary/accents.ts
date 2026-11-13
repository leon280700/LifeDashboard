export type CardAccent = {
  card: string;
  iconBox: string;
  badge: string;
};

export type TileAccent = CardAccent & {
  selected: string;
  hover: string;
  check: string;
};

export const cardAccents = {
  cyan: {
    card: "from-cyan-500/10",
    iconBox: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/30",
    badge: "bg-cyan-500/15 text-cyan-300",
  },
  indigo: {
    card: "from-indigo-500/10",
    iconBox: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30",
    badge: "bg-indigo-500/15 text-indigo-300",
  },
  neutral: {
    card: "from-neutral-500/10",
    iconBox: "bg-neutral-500/15 text-neutral-300 ring-neutral-400/30",
    badge: "bg-neutral-500/15 text-neutral-300",
  },
} satisfies Record<string, CardAccent>;

export const tileAccents = {
  emerald: {
    card: "from-emerald-500/10",
    iconBox: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    badge: "bg-emerald-500/15 text-emerald-300",
    selected:
      "border-emerald-400/70 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10",
    hover: "hover:border-emerald-400/40",
    check: "bg-emerald-400 text-emerald-950",
  },
  rose: {
    card: "from-rose-500/10",
    iconBox: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    badge: "bg-rose-500/15 text-rose-300",
    selected:
      "border-rose-400/70 bg-rose-500/15 text-white shadow-lg shadow-rose-500/10",
    hover: "hover:border-rose-400/40",
    check: "bg-rose-400 text-rose-950",
  },
  violet: {
    card: "from-violet-500/10",
    iconBox: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
    badge: "bg-violet-500/15 text-violet-300",
    selected:
      "border-violet-400/70 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10",
    hover: "hover:border-violet-400/40",
    check: "bg-violet-400 text-violet-950",
  },
  amber: {
    card: "from-amber-500/10",
    iconBox: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
    badge: "bg-amber-500/15 text-amber-300",
    selected:
      "border-amber-400/70 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10",
    hover: "hover:border-amber-400/40",
    check: "bg-amber-400 text-amber-950",
  },
  sky: {
    card: "from-sky-500/10",
    iconBox: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
    badge: "bg-sky-500/15 text-sky-300",
    selected:
      "border-sky-400/70 bg-sky-500/15 text-white shadow-lg shadow-sky-500/10",
    hover: "hover:border-sky-400/40",
    check: "bg-sky-400 text-sky-950",
  },
} satisfies Record<string, TileAccent>;

// Überschrift über einem Abschnitt (Befinden, Aktivitäten, Notizen)
export const sectionHeading = "mb-3 text-2xl font-medium text-white";

// Gemeinsame Grundform einer Kachel (Aktivität oder Befinden)
export const tileBase =
  "relative flex flex-col rounded-xl border p-3 text-left text-sm leading-snug";
