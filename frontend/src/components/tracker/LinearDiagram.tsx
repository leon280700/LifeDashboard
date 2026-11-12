import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useMonthStatsApi } from "../../api/useMonthStatsApi";
import Button from "../ui/Button";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const monthFormat = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

export default function LinearDiagram({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1-12
  });
  const { days, error } = useMonthStatsApi(view.year, view.month, refreshKey);

  const isCurrentMonth =
    view.year === now.getFullYear() && view.month === now.getMonth() + 1;

  const goToMonth = (delta: number) => {
    const d = new Date(view.year, view.month - 1 + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };

  // X-Achse: alle Tage des Monats. Tage ohne Eintrag (z. B. Zukunft) bleiben leer,
  // dadurch "wächst" die Linie im laufenden Monat.
  const daysInMonth = new Date(view.year, view.month, 0).getDate();
  const dayByNumber = new Map(
    days.map((d) => [Number(d.date.slice(8, 10)), d]),
  );
  const data = Array.from(
    { length: daysInMonth },
    (_, i) => dayByNumber.get(i + 1)?.percent ?? null,
  );

  const series = [{ name: "Ziele erreicht", data }];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
      foreColor: "#fff",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    markers: { size: 4 },
    xaxis: {
      categories: Array.from({ length: daysInMonth }, (_, i) => String(i + 1)),
      title: { text: "Tag" },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v) => `${Math.round(v)}%` },
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const day = dayByNumber.get(dataPointIndex + 1);
        if (!day) return "";
        const items = day.goals
          .map((g) => {
            const label = escapeHtml(
              g.condition ? `${g.category} (${g.condition})` : g.category,
            );
            const style = g.achieved ? "color:#000" : "color:#9a9a9a";
            return `<li style="${style}">${g.achieved ? "✓" : "✗"} ${label}</li>`;
          })
          .join("");
        return `<div style="padding:8px 12px"><strong style="color:#000">${dataPointIndex + 1}. – ${day.percent}%</strong><ul style="list-style:none;margin:4px 0 0;padding:0">${items}</ul></div>`;
      },
    },
  };

  return (
    <div className="mb-12 p-4 rounded border border-neutral-600 bg-neutral-700">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          styleType="primary"
          text="<"
          onClick={() => goToMonth(-1)}
        />
        <h2 className="mb-0 text-white">
          {monthFormat.format(new Date(view.year, view.month - 1, 1))}
        </h2>
        <Button
          type="button"
          styleType="primary"
          text=">"
          onClick={() => goToMonth(1)}
          disabled={isCurrentMonth}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
}
