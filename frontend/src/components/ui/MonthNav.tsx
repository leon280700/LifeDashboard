import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "./IconButton";

type MonthNavProps = {
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

export default function MonthNav({
  onPrevious,
  onNext,
  nextDisabled,
}: MonthNavProps) {
  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={ChevronLeft}
        label="Vorheriger Monat"
        onClick={onPrevious}
      />
      <IconButton
        icon={ChevronRight}
        label="Nächster Monat"
        onClick={onNext}
        disabled={nextDisabled}
      />
    </div>
  );
}
