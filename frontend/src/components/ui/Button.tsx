type ButtonProps = {
  styleType: "primary" | "secondary";
  type: "button" | "submit";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

const styles = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-neutral-600 hover:bg-neutral-500",
};

export default function Button({
  styleType,
  type,
  text,
  onClick: handleOnClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`mt-2 rounded px-3 py-1.5 text-white disabled:opacity-50 ${styles[styleType]}`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
