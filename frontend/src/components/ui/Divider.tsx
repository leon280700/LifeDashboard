type Props = {
  /** Optionaler Text in der Mitte der Linie */
  label?: string;
  className?: string;
};

const line = "h-px flex-1 bg-linear-to-r from-transparent to-neutral-600/70";

export default function Divider({ label, className = "my-12" }: Props) {
  if (!label) {
    return (
      <hr
        className={`h-px border-0 bg-linear-to-r from-transparent via-neutral-600/70 to-transparent ${className}`}
      />
    );
  }

  return (
    <div role="separator" className={`flex items-center gap-4 ${className}`}>
      <span className={line} aria-hidden />
      <span className="text-xs font-medium tracking-widest text-neutral-500 uppercase">
        {label}
      </span>
      <span className={`${line} rotate-180`} aria-hidden />
    </div>
  );
}
