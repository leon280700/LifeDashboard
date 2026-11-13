import { CHART_SURFACE } from "@/helpers/lineChart";

type LegendItem = {
  name: string;
  color: string;
  shape?: "circle" | "square";
};

export default function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-300">
      {items.map(({ name, color, shape = "circle" }) => (
        <li key={name} className="flex items-center gap-2">
          <svg width="22" height="10" aria-hidden>
            <line x1="0" y1="5" x2="22" y2="5" stroke={color} strokeWidth="2" />
            {shape === "circle" ? (
              <circle
                cx="11"
                cy="5"
                r="4"
                fill={color}
                stroke={CHART_SURFACE}
                strokeWidth="1.5"
              />
            ) : (
              <rect
                x="7"
                y="1"
                width="8"
                height="8"
                fill={color}
                stroke={CHART_SURFACE}
                strokeWidth="1.5"
              />
            )}
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}
