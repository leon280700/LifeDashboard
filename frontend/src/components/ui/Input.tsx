type InputProps = {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  onChange,
  placeholder,
  name,
  value,
}: InputProps) {
  return (
    <input
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      value={value}
      className="bg-light text-black border rounded p-2"
    />
  );
}
