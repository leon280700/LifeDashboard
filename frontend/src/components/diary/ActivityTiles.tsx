import {
  activityCategories,
  type Activity,
  type ActivityCategoryKey,
  type ActivityKey,
} from "@/types/diary.types";
import {
  Activity as ActivityIcon,
  Brain,
  Check,
  ChefHat,
  Coffee,
  Dices,
  Dumbbell,
  Feather,
  Film,
  Flower2,
  Footprints,
  Gamepad2,
  Heart,
  Lightbulb,
  MicVocal,
  NotebookPen,
  PartyPopper,
  Store,
  User,
  Users,
  Wind,
  Wine,
  type LucideIcon,
} from "lucide-react";

const activityIcons: Record<ActivityKey, LucideIcon> = {
  skate: Wind,
  badminton: Feather,
  gym: Dumbbell,
  running: Footprints,
  friends: Users,
  me_time: User,
  cinema: Film,
  fleamarket: Store,
  relationship: Heart,
  concert: MicVocal,
  alcohol: Wine,
  games_analog: Dices,
  games: Gamepad2,
  journal: NotebookPen,
  meditate: Flower2,
  project: Lightbulb,
  kochen: ChefHat,
};

const categoryStyles: Record<
  ActivityCategoryKey,
  {
    icon: LucideIcon;
    card: string;
    iconBox: string;
    badge: string;
    selected: string;
    hover: string;
    check: string;
  }
> = {
  physical: {
    icon: ActivityIcon,
    card: "from-emerald-500/10",
    iconBox: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    badge: "bg-emerald-500/15 text-emerald-300",
    selected:
      "border-emerald-400/70 bg-emerald-500/15 text-white shadow-lg shadow-emerald-500/10",
    hover: "hover:border-emerald-400/40",
    check: "bg-emerald-400 text-emerald-950",
  },
  social: {
    icon: PartyPopper,
    card: "from-rose-500/10",
    iconBox: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
    badge: "bg-rose-500/15 text-rose-300",
    selected:
      "border-rose-400/70 bg-rose-500/15 text-white shadow-lg shadow-rose-500/10",
    hover: "hover:border-rose-400/40",
    check: "bg-rose-400 text-rose-950",
  },
  mental: {
    icon: Brain,
    card: "from-violet-500/10",
    iconBox: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
    badge: "bg-violet-500/15 text-violet-300",
    selected:
      "border-violet-400/70 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10",
    hover: "hover:border-violet-400/40",
    check: "bg-violet-400 text-violet-950",
  },
  everyday: {
    icon: Coffee,
    card: "from-amber-500/10",
    iconBox: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
    badge: "bg-amber-500/15 text-amber-300",
    selected:
      "border-amber-400/70 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10",
    hover: "hover:border-amber-400/40",
    check: "bg-amber-400 text-amber-950",
  },
};

type Props = {
  selected: Activity[];
  onToggle?: (activity: Activity) => void;
};

export default function ActivityTiles({ selected, onToggle }: Props) {
  const readOnly = !onToggle;

  const categories = activityCategories
    .map((category) => {
      const entries = (
        Object.entries(category.activities) as [ActivityKey, Activity][]
      ).filter(([, activity]) => !readOnly || selected.includes(activity));
      const total = Object.keys(category.activities).length;
      const count = Object.values(category.activities).filter((a) =>
        selected.includes(a),
      ).length;
      return { ...category, entries, total, count };
    })
    .filter((category) => category.entries.length > 0);

  if (readOnly && categories.length === 0) {
    return (
      <p className="text-neutral-400">Heute keine Aktivitäten eingetragen.</p>
    );
  }

  return (
    <div className="columns-1 gap-4 md:columns-2 [&>section]:mb-4 [&>section]:break-inside-avoid">
      {categories.map((category) => {
        const style = categoryStyles[category.key];
        const CategoryIcon = style.icon;
        const headingId = `activity-category-${category.key}`;

        return (
          <section
            key={category.key}
            aria-labelledby={headingId}
            className={`rounded-2xl border border-neutral-700/70 bg-linear-to-br ${style.card} to-neutral-800/40 p-4 sm:p-5`}
          >
            <header className="mb-4 flex items-center gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-xl ring-1 ${style.iconBox}`}
              >
                <CategoryIcon className="size-5" aria-hidden />
              </span>
              <h3 id={headingId} className="text-lg font-semibold text-white">
                {category.label}
              </h3>
              {!readOnly && (
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${style.badge}`}
                >
                  {category.count}/{category.total}
                </span>
              )}
            </header>

            <div className="grid grid-cols-2 gap-2.5">
              {category.entries.map(([key, activity]) => {
                const Icon = activityIcons[key];
                const isSelected = selected.includes(activity);
                const tileBase =
                  "relative flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border p-3 text-left text-sm leading-snug";

                if (readOnly) {
                  return (
                    <div key={key} className={`${tileBase} ${style.selected}`}>
                      <Icon className="size-5" aria-hidden />
                      <span>{activity}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onToggle(activity)}
                    className={`${tileBase} cursor-pointer transition duration-150 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none active:scale-[0.97] ${
                      isSelected
                        ? style.selected
                        : `border-neutral-700 bg-neutral-800/70 text-neutral-300 hover:bg-neutral-800 hover:text-white ${style.hover}`
                    }`}
                  >
                    <Icon
                      className={`size-5 transition ${isSelected ? "" : "opacity-70"}`}
                      aria-hidden
                    />
                    <span>{activity}</span>
                    <span
                      className={`absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full transition duration-150 ${
                        isSelected ? `${style.check} scale-100` : "scale-0"
                      }`}
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
