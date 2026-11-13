import { useMonthStatsApi } from "@/api/useMonthStatsApi";
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
  tooltipValueRow,
} from "@/helpers/lineChart";
import { useMonthView } from "@/helpers/useMonthView";
import type { DayPercent } from "@/types/tracker.types";
import { ChartLine } from "lucide-react";
import ReactApexChart from "react-apexcharts";

// Linienfarbe geprüft mit dem Palette-Validator (dunkler Modus, Kartenfläche)
const series = { name: "Ziele erreicht", color: "#3b82f6" };

// Ausschnitt eines Tages für den Hover-Tooltip: Anteil und erreichte/verfehlte Ziele
function tooltipHtml(day: DayPercent) {
  const goals = day.goals
    .map((g) => {
      const label = escapeHtml(
        g.condition ? `${g.category} (${g.condition})` : g.category,
      );
      return g.achieved
        ? `<li class="flex gap-2 text-neutral-200"><span class="text-emerald-400" aria-hidden="true">✓</span>${label}</li>`
        : `<li class="flex gap-2 text-neutral-500"><span aria-hidden="true">✗</span>${label}</li>`;
    })
    .join("");

  return tooltipFrame(
    formatShortDate(day.date),
    tooltipValueRow(series.name, series.color, `${day.percent}%`) +
      (goals ? `<ul class="mt-2 space-y-0.5">${goals}</ul>` : ""),
  );
}

export default function LinearDiagram({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const { year, month, isCurrentMonth, goToMonth } = useMonthView();
  const { days, error, loading, retry } = useMonthStatsApi(
    year,
    month,
    refreshKey,
  );

  const dates = monthDates(year, month);
  const dayByDate = new Map(days.map((d) => [d.date, d]));

  const chartSeries = [
    {
      name: series.name,
      data: dates.map((d) => dayByDate.get(d)?.percent ?? null),
    },
  ];

  const options = lineChartOptions({
    dates,
    colors: [series.color],
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: { formatter: (v) => `${Math.round(v)}%` },
    },
    tooltip: (index) => {
      const day = dayByDate.get(dates[index]);
      return day ? tooltipHtml(day) : "";
    },
  });

  return (
    <div className="mb-12">
      <TileCard
        title={formatMonth(year, month) + " – Habit Tracker"}
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
        <ChartLegend items={[series]} />

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
          className={`line-chart relative transition-opacity ${loading ? "opacity-50" : ""}`}
        >
          <ReactApexChart
            options={options}
            series={chartSeries}
            type="line"
            height={CHART_HEIGHT}
          />
          {!loading && !error && days.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-neutral-400">
              Keine Einträge in diesem Monat.
            </p>
          )}
        </div>
      </TileCard>
    </div>
  );
}
