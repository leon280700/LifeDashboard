import type { LucideIcon } from "lucide-react";

type ButtonProps = {
  styleType: "primary" | "secondary";
  type: "button" | "submit";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Optionales Icon links vom Text */
  icon?: LucideIcon;
  /** Ersetzt den Standard-Abstand nach oben (mt-2), z. B. "" in Flex-Zeilen */
  className?: string;
};

const styles = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 focus-visible:ring-blue-500/40",
  secondary:
    "border border-neutral-700 bg-neutral-800 text-neutral-100 hover:border-neutral-600 hover:bg-neutral-700 focus-visible:ring-white/20",
};

export default function Button({
  styleType,
  type,
  text,
  onClick: handleOnClick,
  disabled,
  icon: Icon,
  className = "mt-2",
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition duration-150 outline-none focus-visible:ring-4 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${styles[styleType]} ${className}`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {Icon && <Icon className="size-4" aria-hidden />}
      {text}
    </button>
  );
}
