type InputProps = {
  placeholder?: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  onChange,
  placeholder,
  name,
  value,
  className = "",
}: InputProps) {
  return (
    <input
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      value={value}
      className={`rounded border border-neutral-300 bg-neutral-100 p-2 text-black ${className}`}
    />
  );
}
