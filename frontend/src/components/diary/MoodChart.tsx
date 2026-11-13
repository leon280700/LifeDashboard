import { useDiaryMonthApi } from "@/api/useDiaryMonthApi";
import DayDetailModal from "@/components/diary/DayDetailModal";
import TileCard from "@/components/diary/TileCard";
import { cardAccents } from "@/components/diary/accents";
import Button from "@/components/ui/Button";
import ErrorBox from "@/components/ui/ErrorBox";
import IconButton from "@/components/ui/IconButton";
import { formatShortDate } from "@/helpers/dates";
import {
  moodLabels,
  symptoms,
  type DiaryEntry,
  type Mood,
} from "@/types/diary.types";
import type { ApexOptions } from "apexcharts";
import { ChartLine, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

const series = [
  {
    key: "moodPhysical",
    name: "Körperlich",
    color: "#0e9fbf",
    shape: "circle",
  },
  {
    key: "moodMental",
    name: "Psychisch",
    color: "#6366f1",
    shape: "square",
  },
] as const;

const SURFACE = "#17171a";

const monthFormat = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const truncate = (s: string, max: number) =>
  s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;

// Liste mit höchstens `max` Einträgen, Rest als "+n"
const shortList = (items: string[], max: number) =>
  items.length > max
    ? `${items.slice(0, max).join(", ")} <span class="text-neutral-500">+${items.length - max}</span>`
    : items.join(", ");

// Ausschnitt eines Tages für den Hover-Tooltip (HTML-String für ApexCharts)
function tooltipHtml(entry: DiaryEntry) {
  const moodRow = (name: string, color: string, mood: Mood | null) => `
    <div class="flex items-center gap-2">
      <span class="size-2.5 shrink-0 rounded-full" style="background:${color}"></span>
      <span class="text-neutral-400">${name}</span>
      <span class="ml-auto pl-4 font-medium text-white tabular-nums">${
        mood === null ? "–" : `${mood} · ${moodLabels[mood]}`
      }</span>
    </div>`;

  const section = (label: string, content: string) => `
    <div class="mt-2">
      <div class="text-[10px] font-medium tracking-wide text-neutral-500 uppercase">${label}</div>
      <div class="text-neutral-200">${content}</div>
    </div>`;

  const symptomLabels = entry.symptoms.map((s) => escapeHtml(symptoms[s]));
  const activityLabels = entry.activities.map(escapeHtml);

  return `
    <div class="w-64 p-3 text-xs leading-relaxed whitespace-normal">
      <div class="mb-2 text-sm font-semibold text-white">${formatShortDate(entry.date)}</div>
      ${series.map((s) => moodRow(s.name, s.color, entry[s.key])).join("")}
      ${symptomLabels.length ? section("Symptome", shortList(symptomLabels, 4)) : ""}
      ${activityLabels.length ? section("Aktivitäten", shortList(activityLabels, 3)) : ""}
      ${entry.notes ? section("Notizen", escapeHtml(truncate(entry.notes, 90))) : ""}
      <div class="mt-3 border-t border-neutral-800 pt-2 text-neutral-500">Klicken für Details</div>
    </div>`;
}

export default function MoodChart({ refreshKey = 0 }: { refreshKey?: number }) {
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1-12
  });
  const [openDate, setOpenDate] = useState<string | null>(null);
  // Tag unter dem Mauszeiger (vom Tooltip gesetzt), damit ein Klick auf die ganze
  // Spalte reicht und nicht genau den kleinen Punkt treffen muss
  const hoveredDate = useRef<string | null>(null);

  const { entries, error, loading, retry } = useDiaryMonthApi(
    view.year,
    view.month,
    refreshKey,
  );

  const isCurrentMonth =
    view.year === now.getFullYear() && view.month === now.getMonth() + 1;

  const goToMonth = (delta: number) => {
    const d = new Date(view.year, view.month - 1 + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };

  const entriesByDate = useMemo(
    () => new Map(entries.map((e) => [e.date, e])),
    [entries],
  );

  const daysInMonth = new Date(view.year, view.month, 0).getDate();
  const dates = Array.from(
    { length: daysInMonth },
    (_, i) =>
      `${view.year}-${String(view.month).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
  );

  const chartSeries = series.map((s) => ({
    name: s.name,
    data: dates.map((d) => entriesByDate.get(d)?.[s.key] ?? null),
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
      foreColor: "#a3a3a3",
      fontFamily: "inherit",
      events: {
        click: () => {
          const date = hoveredDate.current;
          if (date && entriesByDate.has(date)) setOpenDate(date);
        },
        mouseLeave: () => {
          hoveredDate.current = null;
        },
      },
    },
    colors: series.map((s) => s.color),
    stroke: { curve: "straight", width: 2 },
    markers: {
      size: 5,
      shape: series.map((s) => s.shape),
      strokeWidth: 2,
      strokeColors: SURFACE, // Ring in Flächenfarbe trennt überlappende Punkte
      hover: { size: 7 },
      // Sonst legt ApexCharts nach jeder Lücke einen Mini-Punkt darüber, der wie ein Loch aussieht
      showNullDataPoints: false,
    },
    dataLabels: { enabled: false },
    legend: { show: false }, // eigene Legende über dem Diagramm
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
    yaxis: {
      min: 0,
      max: 4,
      tickAmount: 4,
      labels: { formatter: (v) => String(Math.round(v)) },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      custom: ({ dataPointIndex }) => {
        const date = dates[dataPointIndex];
        const entry = entriesByDate.get(date);
        hoveredDate.current = entry ? date : null;
        return entry ? tooltipHtml(entry) : "";
      },
    },
  };

  const monthNav = (
    <div className="flex items-center gap-2">
      <IconButton
        icon={ChevronLeft}
        label="Vorheriger Monat"
        onClick={() => goToMonth(-1)}
      />
      <IconButton
        icon={ChevronRight}
        label="Nächster Monat"
        onClick={() => goToMonth(1)}
        disabled={isCurrentMonth}
      />
    </div>
  );

  return (
    <>
      <TileCard
        title={monthFormat.format(new Date(view.year, view.month - 1, 1))}
        icon={ChartLine}
        accent={cardAccents.neutral}
        aside={monthNav}
      >
        <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-300">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <svg width="22" height="10" aria-hidden>
                <line
                  x1="0"
                  y1="5"
                  x2="22"
                  y2="5"
                  stroke={s.color}
                  strokeWidth="2"
                />
                {s.shape === "circle" ? (
                  <circle
                    cx="11"
                    cy="5"
                    r="4"
                    fill={s.color}
                    stroke={SURFACE}
                    strokeWidth="1.5"
                  />
                ) : (
                  <rect
                    x="7"
                    y="1"
                    width="8"
                    height="8"
                    fill={s.color}
                    stroke={SURFACE}
                    strokeWidth="1.5"
                  />
                )}
              </svg>
              {s.name}
            </li>
          ))}
        </ul>

        {error && (
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <ErrorBox message={error} />
            <Button
              type="button"
              styleType="secondary"
              text="Erneut versuchen"
              onClick={retry}
              className=""
            />
          </div>
        )}

        <div
          aria-busy={loading}
          className={`mood-chart relative transition-opacity ${loading ? "opacity-50" : ""} ${entries.length ? "cursor-pointer" : ""}`}
        >
          <ReactApexChart
            options={options}
            series={chartSeries}
            type="line"
            height={300}
          />
          {!loading && !error && entries.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-neutral-400">
              Keine Einträge in diesem Monat.
            </p>
          )}
        </div>

        {/* Textalternative zum Diagramm für Screenreader */}
        <table className="sr-only">
          <caption>Befinden pro Tag</caption>
          <thead>
            <tr>
              <th scope="col">Datum</th>
              <th scope="col">Körperlich</th>
              <th scope="col">Psychisch</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.date}>
                <th scope="row">{formatShortDate(e.date)}</th>
                <td>{e.moodPhysical ?? "–"}</td>
                <td>{e.moodMental}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TileCard>

      {openDate && (
        <DayDetailModal
          initialDate={openDate}
          knownEntries={entriesByDate}
          onClose={() => setOpenDate(null)}
        />
      )}
    </>
  );
}
