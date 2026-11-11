type ButtonProps = {
  styleType: "primary" | "secondary";
  type: "button" | "submit";
  text: string;
  onClick?: () => void;
};

export default function Button({
  styleType,
  type,
  text,
  onClick: handleOnClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${styleType} mt-2`}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
}
