import type { LucideIcon } from "lucide-react";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/70 text-neutral-200 transition duration-150 outline-none hover:border-neutral-600 hover:bg-neutral-700 hover:text-white focus-visible:ring-4 focus-visible:ring-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
