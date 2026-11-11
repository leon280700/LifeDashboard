type ButtonProps = {
  styleType: "primary" | "secondary";
  type: "button" | "submit";
  text: string;
  onClick?: () => void;
  disabled?: boolean;
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
      className={`btn btn-${styleType} mt-2`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
