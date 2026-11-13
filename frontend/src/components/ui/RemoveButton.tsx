import { X } from "lucide-react";

export default function RemoveButton({
  text,
  ariaLabel,
  onClick,
}: {
  text: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={text}
      className="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full text-sky-200/70 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
    >
      <X className="size-4" aria-hidden />
    </button>
  );
}
