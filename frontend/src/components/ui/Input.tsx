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
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

const baseStyle =
  "rounded-xl border border-neutral-700 bg-neutral-800/70 px-4 py-2.5 text-white placeholder:text-neutral-500 transition duration-150 outline-none hover:border-neutral-600 focus:border-blue-500/70 focus:bg-neutral-800 focus:ring-4 focus:ring-blue-500/15";

export default function Input({
  multiline = false,
  rows = 4,
  className = "",
  ...props
}: InputProps) {
  if (multiline) {
    return (
      <textarea
        {...props}
        rows={rows}
        className={`${baseStyle} min-h-24 resize-y leading-relaxed ${className}`}
      />
    );
  }

  return (
    <input type="text" {...props} className={`${baseStyle} ${className}`} />
  );
}
