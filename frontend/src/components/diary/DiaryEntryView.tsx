import ActivityTiles from "@/components/diary/ActivityTiles";
import MoodPicker from "@/components/diary/MoodPicker";
import TileCard from "@/components/diary/TileCard";
import { cardAccents, sectionHeading } from "@/components/diary/accents";
import {
  symptoms_mental,
  symptoms_physical,
  type DiaryEntry,
} from "@/types/diary.types";
import { Brain, HeartPulse, PenLine } from "lucide-react";
import { useId } from "react";

type Props = {
  entry: DiaryEntry;
  activitiesTitle?: string;
};

export default function DiaryEntryView({
  entry,
  activitiesTitle = "Aktivitäten",
}: Props) {
  const id = useId();

  return (
    <div className="space-y-10">
      <div>
        <h2 className={sectionHeading}>Befinden</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MoodPicker
            title="Körperlich"
            icon={HeartPulse}
            accent={cardAccents.cyan}
            name={`${id}-mood-physical`}
            value={entry.moodPhysical}
            symptoms={symptoms_physical}
            selectedSymptoms={entry.symptoms}
          />
          <MoodPicker
            title="Psychisch"
            icon={Brain}
            accent={cardAccents.indigo}
            name={`${id}-mood-mental`}
            value={entry.moodMental}
            symptoms={symptoms_mental}
            selectedSymptoms={entry.symptoms}
          />
        </div>
      </div>

      <div>
        <h2 className={sectionHeading}>{activitiesTitle}</h2>
        <ActivityTiles selected={entry.activities} />
      </div>

      {entry.notes && (
        <div>
          <h2 className={sectionHeading}>Notizen</h2>
          <TileCard
            title="Weitere Anmerkungen?"
            icon={PenLine}
            accent={cardAccents.neutral}
          >
            <p className="leading-relaxed whitespace-pre-wrap text-neutral-200">
              {entry.notes}
            </p>
          </TileCard>
        </div>
      )}
    </div>
  );
}
