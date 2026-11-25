import { MAX_NOTES } from "@/types/diary.types";
import { PenLine } from "lucide-react";
import { cardAccents } from "../diary/accents";
import TileCard, { TileBadge } from "../diary/TileCard";
import Input from "./Input";

type Props = {
  notes: string;
  setNotes: (notes: string) => void;
};

export default function NotesCard({ notes, setNotes }: Props) {
  return (
    <TileCard
      title="Notizen"
      icon={PenLine}
      accent={cardAccents.neutral}
      aside={
        <TileBadge className={cardAccents.neutral.badge}>
          {notes.length}/{MAX_NOTES}
        </TileBadge>
      }
    >
      <Input
        multiline
        rows={5}
        aria-label="Notizen"
        placeholder="Zusätzliche Notizen"
        value={notes}
        maxLength={MAX_NOTES}
        className="w-full"
        onChange={(e) => setNotes(e.target.value)}
      />
    </TileCard>
  );
}
