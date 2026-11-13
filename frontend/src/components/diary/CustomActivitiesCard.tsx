import { MAX_ACTIVITY_LENGTH } from "@/types/diary.types";
import { Sparkles, Tag, Plus } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import RemoveButton from "../ui/RemoveButton";
import { tileAccents } from "./accents";
import TileCard, { TileBadge } from "./TileCard";
import { activityTile } from "./ActivityTiles";

export default function CustomActivitiesCard({
  activities,
  onRemove,
  onAdd,
}: {
  activities: string[];
  onRemove?: (activity: string) => void;
  onAdd?: (activity: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const accent = tileAccents.sky;

  const add = () => {
    if (!onAdd || !draft.trim()) return;
    onAdd(draft);
    setDraft("");
  };

  return (
    <TileCard
      title="Sonstige"
      icon={Sparkles}
      accent={accent}
      aside={
        onAdd && (
          <TileBadge className={accent.badge}>{activities.length}</TileBadge>
        )
      }
    >
      {activities.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {activities.map((activity) => (
            <div
              key={activity}
              className={`${activityTile} ${accent.selected}`}
            >
              <Tag className="size-5" aria-hidden />
              <span className="min-w-0 break-words">{activity}</span>
              {onRemove && (
                <RemoveButton
                  text={"Entfernen"}
                  onClick={() => onRemove(activity)}
                  ariaLabel={`${activity} entfernen`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {onAdd && (
        <>
          {activities.length === 0 && (
            <p className="text-sm text-neutral-400">
              Etwas anderes gemacht? Füge es für heute hinzu.
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <Input
              aria-label="Eigene Aktivität"
              placeholder="Eigene Aktivität…"
              value={draft}
              maxLength={MAX_ACTIVITY_LENGTH}
              className="min-w-0 flex-1"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                // Enter fügt hinzu, statt das ganze Tagebuch-Formular abzuschicken
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  add();
                }
              }}
            />
            <Button
              type="button"
              styleType="secondary"
              text="Hinzufügen"
              icon={Plus}
              onClick={add}
              disabled={!draft.trim()}
              className=""
            />
          </div>
        </>
      )}
    </TileCard>
  );
}
