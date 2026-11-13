export const today = () => new Date().toLocaleDateString("sv");

// Datumsrechnung auf "YYYY-MM-DD"-Strings, in UTC gerechnet, damit Zeitumstellungen nichts verschieben
const parseDate = (date: string) => new Date(`${date}T00:00:00Z`);

export const addDays = (date: string, days: number) => {
  const d = parseDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const longDateFormat = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormat = new Intl.DateTimeFormat("de-DE", {
  weekday: "short",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** z. B. "Donnerstag, 12. November 2026" */
export const formatLongDate = (date: string) =>
  longDateFormat.format(parseDate(date));

/** z. B. "Do., 12. November" */
export const formatShortDate = (date: string) =>
  shortDateFormat.format(parseDate(date));
