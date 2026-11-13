import {
  activityCategories,
  isDefaultActivity,
  type Activity,
  type ActivityCategoryKey,
  type ActivityKey,
} from "@/types/diary.types";
import {
  Activity as ActivityIcon,
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
  Gift,
  Heart,
  Lightbulb,
  MicVocal,
  NotebookPen,
  PartyPopper,
  Puzzle,
  Store,
  User,
  Users,
  Wind,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { tileAccents, tileBase, type TileAccent } from "./accents";
import TileCard, { TileBadge } from "./TileCard";
import CustomActivitiesCard from "./CustomActivitiesCard";

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
  present: Gift,
  games: Gamepad2,
  journal: NotebookPen,
  meditate: Flower2,
  project: Lightbulb,
  kochen: ChefHat,
};

const categoryLook: Record<
  ActivityCategoryKey,
  { icon: LucideIcon; accent: TileAccent }
> = {
  physical: { icon: ActivityIcon, accent: tileAccents.emerald },
  social: { icon: PartyPopper, accent: tileAccents.rose },
  mental: { icon: Puzzle, accent: tileAccents.violet },
  everyday: { icon: Coffee, accent: tileAccents.amber },
};

export const activityTile = `${tileBase} min-h-24 items-start justify-between gap-3`;

type Props = {
  selected: string[];
  onToggle?: (activity: string) => void;
  onAddCustom?: (activity: string) => void;
};

export default function ActivityTiles({
  selected,
  onToggle,
  onAddCustom,
}: Props) {
  const readOnly = !onToggle;
  const customActivities = selected.filter((a) => !isDefaultActivity(a));

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

  if (readOnly && categories.length === 0 && customActivities.length === 0) {
    return (
      <p className="text-neutral-400">Heute keine Aktivitäten eingetragen.</p>
    );
  }

  return (
    <div className="columns-1 gap-4 md:columns-2 [&>section]:mb-4 [&>section]:break-inside-avoid">
      {categories.map((category) => {
        const { icon, accent } = categoryLook[category.key];

        return (
          <TileCard
            key={category.key}
            title={category.label}
            icon={icon}
            accent={accent}
            aside={
              !readOnly && (
                <TileBadge className={accent.badge}>
                  {category.count}/{category.total}
                </TileBadge>
              )
            }
          >
            <div className="grid grid-cols-2 gap-2.5">
              {category.entries.map(([key, activity]) => {
                const Icon = activityIcons[key];
                const isSelected = selected.includes(activity);

                if (readOnly) {
                  return (
                    <div
                      key={key}
                      className={`${activityTile} ${accent.selected}`}
                    >
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
                    className={`${activityTile} cursor-pointer transition duration-150 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none active:scale-[0.97] ${
                      isSelected
                        ? accent.selected
                        : `border-neutral-700 bg-neutral-800/70 text-neutral-300 hover:bg-neutral-800 hover:text-white ${accent.hover}`
                    }`}
                  >
                    <Icon
                      className={`size-5 transition ${isSelected ? "" : "opacity-70"}`}
                      aria-hidden
                    />
                    <span>{activity}</span>
                    <span
                      className={`absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full transition duration-150 ${
                        isSelected ? `${accent.check} scale-100` : "scale-0"
                      }`}
                      aria-hidden
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                  </button>
                );
              })}
            </div>
          </TileCard>
        );
      })}

      {(!readOnly || customActivities.length > 0) && (
        <CustomActivitiesCard
          activities={customActivities}
          onRemove={onToggle}
          onAdd={onAddCustom}
        />
      )}
    </div>
  );
}
