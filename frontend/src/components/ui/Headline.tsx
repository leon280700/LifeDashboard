import { AuroraText } from "./aurora-text";

export default function Headline({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <AuroraText children={children} className={className || "text-4xl pb-2"} />
  );
}
