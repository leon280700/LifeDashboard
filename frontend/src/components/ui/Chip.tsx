import { Check } from "lucide-react";

type ChipProps = {
  text: string;
  selected?: boolean;
  onClick?: () => void;
  selectedClassName?: string;
};

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm leading-none";

const defaultSelected = "border-blue-400/60 bg-blue-500/15 text-blue-100";

export default function Chip({
  text,
  selected = false,
  onClick,
  selectedClassName = defaultSelected,
}: ChipProps) {
  if (!onClick) {
    return <span className={`${base} ${selectedClassName}`}>{text}</span>;
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`${base} cursor-pointer transition duration-150 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none active:scale-95 ${
        selected
          ? selectedClassName
          : "border-neutral-700 bg-neutral-800/70 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      }`}
    >
      {selected && (
        <Check className="-ml-0.5 size-3.5" strokeWidth={3} aria-hidden />
      )}
      {text}
    </button>
  );
}
