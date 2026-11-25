type InputProps = {
  placeholder?: string;
  name?: string;
  id?: string;
  className?: string;
  value?: string;
  maxLength?: number;
  /** Mehrzeiliges Textfeld (textarea) statt einzeiliger Eingabe */
  multiline?: boolean;
  /** Sichtbare Zeilen, nur bei multiline */
  rows?: number;
  "aria-label"?: string;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

const baseStyle =
  "rounded-xl border border-neutral-700 bg-neutral-800/70 px-4 py-2.5 text-white placeholder:text-neutral-500 transition duration-150 outline-none hover:border-neutral-600 focus:border-blue-500/70 focus:bg-neutral-800 focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-700";

export default function Input({
  multiline = false,
  rows = 4,
  className = "",
  disabled,
  ...props
}: InputProps) {
  if (multiline) {
    return (
      <textarea
        {...props}
        rows={rows}
        disabled={disabled}
        className={`${baseStyle} min-h-24 resize-y leading-relaxed ${className}`}
      />
    );
  }

  return (
    <input
      disabled={disabled}
      type="text"
      {...props}
      className={`${baseStyle} ${className}`}
    />
  );
}
