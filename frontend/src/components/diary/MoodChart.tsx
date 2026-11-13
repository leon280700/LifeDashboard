import { useDiaryMonthApi } from "@/api/useDiaryMonthApi";
import DayDetailModal from "@/components/diary/DayDetailModal";
import TileCard from "@/components/diary/TileCard";
import { cardAccents } from "@/components/diary/accents";
import Button from "@/components/ui/Button";
import ChartLegend from "@/components/ui/ChartLegend";
import ErrorBox from "@/components/ui/ErrorBox";
import MonthNav from "@/components/ui/MonthNav";
import { formatShortDate } from "@/helpers/dates";
import {
  CHART_HEIGHT,
  escapeHtml,
  formatMonth,
  lineChartOptions,
  monthDates,
  tooltipFrame,
  tooltipSection,
  tooltipValueRow,
} from "@/helpers/lineChart";
import { useMonthView } from "@/helpers/useMonthView";
import { moodLabels, symptoms, type DiaryEntry } from "@/types/diary.types";
import { ChartLine } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";

// Farben geprüft mit dem Palette-Validator (dunkler Modus): CVD-Abstand ΔE ≥ 13.
// Gleiche Farbtöne wie die Befinden-Karten; zusätzlich unterscheidet die Punktform.
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

const truncate = (s: string, max: number) =>
  s.length > max ? `${s.slice(0, max).trimEnd()}…` : s;

// Liste mit höchstens `max` Einträgen, Rest als "+n"
const shortList = (items: string[], max: number) =>
  items.length > max
    ? `${items.slice(0, max).join(", ")} <span class="text-neutral-500">+${items.length - max}</span>`
    : items.join(", ");

function tooltipHtml(entry: DiaryEntry) {
  const symptomLabels = entry.symptoms.map((s) => escapeHtml(symptoms[s]));
  const activityLabels = entry.activities.map(escapeHtml);

  const body = [
    ...series.map((s) => {
      const mood = entry[s.key];
      return tooltipValueRow(
        s.name,
        s.color,
        mood === null ? "–" : `${mood} · ${moodLabels[mood]}`,
      );
    }),
    symptomLabels.length
      ? tooltipSection("Symptome", shortList(symptomLabels, 4))
      : "",
    activityLabels.length
      ? tooltipSection("Aktivitäten", shortList(activityLabels, 3))
      : "",
    entry.notes
      ? tooltipSection("Notizen", escapeHtml(truncate(entry.notes, 90)))
      : "",
  ].join("");

  return tooltipFrame(formatShortDate(entry.date), body, "Klicken für Details");
}

export default function MoodChart({ refreshKey = 0 }: { refreshKey?: number }) {
  const { year, month, isCurrentMonth, goToMonth } = useMonthView();
  const [openDate, setOpenDate] = useState<string | null>(null);
  // Tag unter dem Mauszeiger (vom Tooltip gesetzt), damit ein Klick auf die ganze
  // Spalte reicht und nicht genau den kleinen Punkt treffen muss
  const hoveredDate = useRef<string | null>(null);

  const { entries, error, loading, retry } = useDiaryMonthApi(
    year,
    month,
    refreshKey,
  );

  const entriesByDate = useMemo(
    () => new Map(entries.map((e) => [e.date, e])),
    [entries],
  );

  const dates = monthDates(year, month);

  const chartSeries = series.map((s) => ({
    name: s.name,
    data: dates.map((d) => entriesByDate.get(d)?.[s.key] ?? null),
  }));

  const options = lineChartOptions({
    dates,
    colors: series.map((s) => s.color),
    markerShapes: series.map((s) => s.shape),
    yaxis: {
      min: 0,
      max: 4,
      tickAmount: 4,
      labels: { formatter: (v) => String(Math.round(v)) },
    },
    tooltip: (index) => {
      const entry = entriesByDate.get(dates[index]);
      hoveredDate.current = entry ? entry.date : null;
      return entry ? tooltipHtml(entry) : "";
    },
    events: {
      click: () => {
        const date = hoveredDate.current;
        if (date && entriesByDate.has(date)) setOpenDate(date);
      },
      mouseLeave: () => {
        hoveredDate.current = null;
      },
    },
  });

  return (
    <>
      <TileCard
        title={
          formatMonth(year, month) + " – Körperliches und seelisches Empfinden"
        }
        icon={ChartLine}
        accent={cardAccents.neutral}
        aside={
          <MonthNav
            onPrevious={() => goToMonth(-1)}
            onNext={() => goToMonth(1)}
            nextDisabled={isCurrentMonth}
          />
        }
      >
        <ChartLegend items={[...series]} />

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
          className={`line-chart relative transition-opacity ${loading ? "opacity-50" : ""} ${entries.length ? "cursor-pointer" : ""}`}
        >
          <ReactApexChart
            options={options}
            series={chartSeries}
            type="line"
            height={CHART_HEIGHT}
          />
          {!loading && !error && entries.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-neutral-400">
              Keine Einträge in diesem Monat.
            </p>
          )}
        </div>
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
