CREATE TABLE IF NOT EXISTS goals (
  id          INTEGER PRIMARY KEY,
  category    TEXT NOT NULL,
  condition   TEXT NOT NULL DEFAULT '',
  active_from TEXT NOT NULL,          -- YYYY-MM-DD
  active_to   TEXT                    -- NULL = noch aktiv
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_goals_one_active
  ON goals(category) WHERE active_to IS NULL;

CREATE TABLE IF NOT EXISTS goal_checks (
  date     TEXT NOT NULL,             -- YYYY-MM-DD
  goal_id  INTEGER NOT NULL REFERENCES goals(id),
  achieved INTEGER NOT NULL CHECK (achieved IN (0, 1)),
  PRIMARY KEY (date, goal_id)
);

CREATE TABLE IF NOT EXISTS day_notes (
  date  TEXT PRIMARY KEY,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS diary_entries (
  date          TEXT PRIMARY KEY,     -- YYYY-MM-DD
  mood_physical INTEGER NOT NULL,
  mood_mental   INTEGER NOT NULL,
  notes         TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS diary_activities (
  date     TEXT NOT NULL REFERENCES diary_entries(date) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  PRIMARY KEY (date, activity)
);

CREATE TABLE IF NOT EXISTS diary_symptoms (
  date    TEXT NOT NULL REFERENCES diary_entries(date) ON DELETE CASCADE,
  symptom TEXT NOT NULL,
  PRIMARY KEY (date, symptom)
);
