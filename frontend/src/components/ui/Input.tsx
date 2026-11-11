type InputProps = {
  placeholder?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ onChange, placeholder, name }: InputProps) {
  return (
    <input
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      className="bg-light text-black border rounded p-2"
    />
  );
}
