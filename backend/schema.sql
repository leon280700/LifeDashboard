CREATE TABLE IF NOT EXISTS goals (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS goal_checks (
  date     TEXT NOT NULL,            -- YYYY-MM-DD
  goal_id  INTEGER NOT NULL REFERENCES goals(id),
  achieved INTEGER NOT NULL CHECK (achieved IN (0, 1)),
  PRIMARY KEY (date, goal_id)
);

CREATE TABLE IF NOT EXISTS day_notes (
  date  TEXT PRIMARY KEY,
  notes TEXT NOT NULL DEFAULT ''
);
