import { useState } from "react";

export function useMonthView() {
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1, // 1-12
  });

  const isCurrentMonth =
    view.year === now.getFullYear() && view.month === now.getMonth() + 1;

  const goToMonth = (delta: number) => {
    const d = new Date(view.year, view.month - 1 + delta, 1);
    setView({ year: d.getFullYear(), month: d.getMonth() + 1 });
  };

  return { ...view, isCurrentMonth, goToMonth };
}
