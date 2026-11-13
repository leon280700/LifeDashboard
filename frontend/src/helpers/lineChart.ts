import type { ApexOptions } from "apexcharts";

/** Eine einzelne Y-Achse (ApexOptions erlaubt auch ein Array) */
type YAxis = Exclude<ApexOptions["yaxis"], unknown[] | undefined>;

/** Fläche hinter dem Diagramm, für den Ring um die Punkte */
export const CHART_SURFACE = "#17171a";

export const CHART_HEIGHT = 300;

const monthFormat = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

/** z. B. "November 2026" */
export const formatMonth = (year: number, month: number) =>
  monthFormat.format(new Date(year, month - 1, 1));

/** Alle Tage eines Monats als "YYYY-MM-DD" */
export const monthDates = (year: number, month: number) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) =>
      `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
  );

/** Für Nutzerdaten in Tooltip-HTML */
export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

type LineChartConfig = {
  dates: string[];
  colors: string[];
  markerShapes?: ("circle" | "square")[];
  yaxis: YAxis;
  /** HTML des Hover-Tooltips für den Tag an Position `index` ("" = kein Tooltip) */
  tooltip: (index: number) => string;
  events?: NonNullable<ApexOptions["chart"]>["events"];
};

export function lineChartOptions({
  dates,
  colors,
  markerShapes,
  yaxis,
  tooltip,
  events,
}: LineChartConfig): ApexOptions {
  return {
    chart: {
      type: "line",
      height: CHART_HEIGHT,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
      foreColor: "#a3a3a3",
      fontFamily: "inherit",
      events,
    },
    colors,
    stroke: { curve: "straight", width: 2 },
    markers: {
      size: 5,
      shape: markerShapes ?? "circle",
      strokeWidth: 2,
      strokeColors: CHART_SURFACE, // Ring in Flächenfarbe trennt überlappende Punkte
      hover: { size: 7 },
      // Sonst legt ApexCharts nach jeder Lücke einen Mini-Punkt darüber, der wie ein Loch aussieht
      showNullDataPoints: false,
    },
    dataLabels: { enabled: false },
    legend: { show: false }, // Legende rendern die Diagramme selbst (ChartLegend)
    grid: {
      borderColor: "rgba(255,255,255,0.06)",
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories: dates.map((d) => String(Number(d.slice(8)))),
      axisBorder: { color: "rgba(255,255,255,0.1)" },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      crosshairs: {
        stroke: { color: "rgba(255,255,255,0.2)", width: 1, dashArray: 4 },
      },
      labels: { rotate: 0, hideOverlappingLabels: true },
    },
    yaxis,
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      custom: ({ dataPointIndex }) => tooltip(dataPointIndex),
    },
  };
}

export const tooltipFrame = (title: string, body: string, footer?: string) => `
  <div class="w-64 p-3 text-xs leading-relaxed whitespace-normal">
    <div class="mb-2 text-sm font-semibold text-white">${title}</div>
    ${body}
    ${footer ? `<div class="mt-3 border-t border-neutral-800 pt-2 text-neutral-500">${footer}</div>` : ""}
  </div>`;

export const tooltipValueRow = (name: string, color: string, value: string) => `
  <div class="flex items-center gap-2">
    <span class="size-2.5 shrink-0 rounded-full" style="background:${color}"></span>
    <span class="text-neutral-400">${name}</span>
    <span class="ml-auto pl-4 font-medium text-white tabular-nums">${value}</span>
  </div>`;

export const tooltipSection = (label: string, content: string) => `
  <div class="mt-2">
    <div class="text-[10px] font-medium tracking-wide text-neutral-500 uppercase">${label}</div>
    <div class="text-neutral-200">${content}</div>
  </div>`;
