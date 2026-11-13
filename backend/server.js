import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db.js';

const __dirname = import.meta.dirname;

const app = express();
app.use(cors());
app.use(express.json());


const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD (lokal)
const isDate = (d) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d ?? '')) return false;
  const parsed = new Date(`${d}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(d); // echtes Kalenderdatum
};

const MAX_NOTES = 2000;
const MAX_CATEGORY = 50;
const MAX_CONDITION = 200;

// Goals: aktuell gültige Ziele
app.get('/api/goals', (req, res) => {
  res.json(
    db
      .prepare('SELECT id, category, condition, active_from AS activeFrom FROM goals WHERE active_to IS NULL ORDER BY id')
      .all(),
  );
});

// Goals: neue Zielliste setzen. Body: { goals: [{ category, condition }] }
// Geänderte oder entfernte Ziele werden beendet (active_to), geänderte/neue als neue Zeile angelegt.
app.put('/api/goals', (req, res) => {
  const input = req.body?.goals;
  if (
    !Array.isArray(input) ||
    input.some((g) => typeof g?.category !== 'string' || !g.category.trim()) ||
    input.some((g) => g.condition != null && typeof g.condition !== 'string')
  ) {
    return res.status(400).json({ error: 'goals: [{ category, condition }] erforderlich' });
  }
  const list = input.map((g) => ({ category: g.category.trim(), condition: (g.condition ?? '').trim() }));
  if (new Set(list.map((g) => g.category)).size !== list.length) {
    return res.status(400).json({ error: 'goals: Kategorien müssen eindeutig sein' });
  }
  if (list.some((g) => g.category.length > MAX_CATEGORY || g.condition.length > MAX_CONDITION)) {
    return res
      .status(400)
      .json({ error: `goals: category höchstens ${MAX_CATEGORY}, condition höchstens ${MAX_CONDITION} Zeichen` });
  }
  const wanted = new Map(list.map((g) => [g.category, g.condition]));
  const current = db.prepare('SELECT id, category, condition FROM goals WHERE active_to IS NULL').all();
  const close = db.prepare('UPDATE goals SET active_to = ? WHERE id = ?');
  const insert = db.prepare('INSERT INTO goals (category, condition, active_from) VALUES (?, ?, ?)');
  const date = today();

  db.exec('BEGIN');
  try {
    for (const g of current) {
      if (wanted.get(g.category) === g.condition) wanted.delete(g.category); // unverändert
      else close.run(date, g.id); // geändert oder entfernt
    }
    for (const [category, condition] of wanted) insert.run(category, condition, date);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.json(
    db.prepare('SELECT id, category, condition, active_from AS activeFrom FROM goals WHERE active_to IS NULL ORDER BY id').all(),
  );
});

// Tracker: Tages-Eingabe speichern
// Body: { date: "YYYY-MM-DD", checks: { "<goalId>": true, ... }, notes?: string }
app.post('/api/tracker', (req, res) => {
  const { date, checks, notes = '' } = req.body ?? {};
  if (!isDate(date)) return res.status(400).json({ error: 'date (YYYY-MM-DD) erforderlich' });
  if (typeof checks !== 'object' || checks === null || Array.isArray(checks)) {
    return res.status(400).json({ error: 'checks muss ein Objekt { "<goalId>": boolean } sein' });
  }
  if (typeof notes !== 'string') return res.status(400).json({ error: 'notes muss ein String sein' });
  if (notes.length > MAX_NOTES) {
    return res.status(400).json({ error: `notes darf höchstens ${MAX_NOTES} Zeichen lang sein` });
  }
  const existed = !!db.prepare('SELECT 1 FROM day_notes WHERE date = ?').get(date);
  const goals = db.prepare('SELECT id FROM goals WHERE active_to IS NULL').all();
  const upsertCheck = db.prepare(
    'INSERT INTO goal_checks (date, goal_id, achieved) VALUES (?, ?, ?) ON CONFLICT(date, goal_id) DO UPDATE SET achieved = excluded.achieved',
  );
  const upsertNotes = db.prepare(
    'INSERT INTO day_notes (date, notes) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET notes = excluded.notes',
  );
  db.exec('BEGIN');
  try {
    for (const g of goals) upsertCheck.run(date, g.id, checks[g.id] ? 1 : 0);
    upsertNotes.run(date, notes.trim());
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.status(existed ? 200 : 201).json({ date, saved: goals.length });
});

// Tracker: Tagesergebnis in % für einen Monat inkl. der damals gültigen Ziele.
// Tage ohne Eintrag fehlen. Antwort: [{ date, percent, goals: [{ category, condition, achieved }] }]
app.get('/api/tracker/month/:month', (req, res) => {
  const { month } = req.params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'month im Format YYYY-MM erforderlich' });
  }
  const rows = db
    .prepare(
      `SELECT c.date, g.category, g.condition, c.achieved
       FROM goal_checks c JOIN goals g ON g.id = c.goal_id
       WHERE c.date LIKE ? ORDER BY c.date, g.id`,
    )
    .all(`${month}-%`);

  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push({ category: r.category, condition: r.condition, achieved: !!r.achieved });
  }
  res.json(
    [...byDate].map(([date, goals]) => ({
      date,
      percent: Math.round((100 * goals.filter((g) => g.achieved).length) / goals.length),
      goals,
    })),
  );
});

// Tracker: Eingabe eines Tages lesen (inkl. damals gültiger Ziele)
app.get('/api/tracker/:date', (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: 'date im Format YYYY-MM-DD erforderlich' });
  const checks = db
    .prepare(
      'SELECT g.id AS goalId, g.category, g.condition, c.achieved FROM goal_checks c JOIN goals g ON g.id = c.goal_id WHERE c.date = ? ORDER BY g.id',
    )
    .all(date)
    .map((r) => ({ ...r, achieved: !!r.achieved }));
  const note = db.prepare('SELECT notes FROM day_notes WHERE date = ?').get(date);
  if (checks.length === 0 && !note) return res.status(404).json({ error: 'Kein Eintrag für dieses Datum' });
  res.json({ date, checks, notes: note?.notes ?? '' });
});

app.delete('/api/tracker/:date', (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: 'date im Format YYYY-MM-DD erforderlich' });
  const deleteChecks = db.prepare('DELETE FROM goal_checks WHERE date = ?');
  const deleteNotes = db.prepare('DELETE FROM day_notes WHERE date = ?');
  db.exec('BEGIN');
  try {
    deleteChecks.run(date);
    deleteNotes.run(date);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.json({ date, deleted: true });
});


// Tagebuch: Wertebereich des Befindens (hier anpassen, wenn erweitert werden soll)
const MOOD_MIN = 0;
const MOOD_MAX = 4;
const isMood = (m) => Number.isInteger(m) && m >= MOOD_MIN && m <= MOOD_MAX;
const MAX_ACTIVITIES = 50;
const MAX_ACTIVITY_LENGTH = 100;
const MAX_SYMPTOMS = 50;
const isSymptomKey = (s) => typeof s === 'string' && /^[a-z0-9_]{1,50}$/.test(s);

const readDiary = (date) => {
  const entry = db
    .prepare('SELECT mood_physical, mood_mental, notes FROM diary_entries WHERE date = ?')
    .get(date);
  if (!entry) return null;
  const activities = db
    .prepare('SELECT activity FROM diary_activities WHERE date = ? ORDER BY rowid')
    .all(date)
    .map((r) => r.activity);
  const symptoms = db
    .prepare('SELECT symptom FROM diary_symptoms WHERE date = ? ORDER BY rowid')
    .all(date)
    .map((r) => r.symptom);
  return {
    date,
    moodPhysical: entry.mood_physical,
    moodMental: entry.mood_mental,
    symptoms,
    activities,
    notes: entry.notes,
  };
};

// Tagebuch: Eintrag speichern (legt an oder überschreibt den Tag)
// Body: { date: "YYYY-MM-DD", moodPhysical: 0..4, moodMental: 0..4, symptoms?: string[],
//         activities?: string[], notes?: string }
app.put('/api/diary', (req, res) => {
  const { date, moodPhysical, moodMental, symptoms = [], activities = [], notes = '' } = req.body ?? {};
  if (!isDate(date)) return res.status(400).json({ error: 'date (YYYY-MM-DD) erforderlich' });
  if (!isMood(moodPhysical) || !isMood(moodMental)) {
    return res
      .status(400)
      .json({ error: `moodPhysical und moodMental müssen ganze Zahlen von ${MOOD_MIN} bis ${MOOD_MAX} sein` });
  }
  if (!Array.isArray(symptoms) || symptoms.length > MAX_SYMPTOMS || !symptoms.every(isSymptomKey)) {
    return res
      .status(400)
      .json({ error: `symptoms muss eine Liste von höchstens ${MAX_SYMPTOMS} Keys (a-z, 0-9, _) sein` });
  }
  if (!Array.isArray(activities) || activities.some((a) => typeof a !== 'string')) {
    return res.status(400).json({ error: 'activities muss eine Liste von Strings sein' });
  }
  if (typeof notes !== 'string') return res.status(400).json({ error: 'notes muss ein String sein' });
  if (notes.length > MAX_NOTES) {
    return res.status(400).json({ error: `notes darf höchstens ${MAX_NOTES} Zeichen lang sein` });
  }

  const names = [...new Set(activities.map((a) => a.trim()).filter(Boolean))];
  if (names.length > MAX_ACTIVITIES || names.some((a) => a.length > MAX_ACTIVITY_LENGTH)) {
    return res
      .status(400)
      .json({ error: `activities: höchstens ${MAX_ACTIVITIES} Einträge mit je max. ${MAX_ACTIVITY_LENGTH} Zeichen` });
  }
  const existed = !!db.prepare('SELECT 1 FROM diary_entries WHERE date = ?').get(date);
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO diary_entries (date, mood_physical, mood_mental, notes) VALUES (?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET
         mood_physical = excluded.mood_physical, mood_mental = excluded.mood_mental, notes = excluded.notes`,
    ).run(date, moodPhysical, moodMental, notes.trim());
    db.prepare('DELETE FROM diary_activities WHERE date = ?').run(date);
    const insert = db.prepare('INSERT INTO diary_activities (date, activity) VALUES (?, ?)');
    for (const a of names) insert.run(date, a);
    db.prepare('DELETE FROM diary_symptoms WHERE date = ?').run(date);
    const insertSymptom = db.prepare('INSERT INTO diary_symptoms (date, symptom) VALUES (?, ?)');
    for (const s of new Set(symptoms)) insertSymptom.run(date, s);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.status(existed ? 200 : 201).json(readDiary(date));
});

// Tagebuch: bisher verwendete Activities (für Vorschläge)
app.get('/api/diary/activities', (req, res) => {
  res.json(
    db
      .prepare('SELECT activity FROM diary_activities GROUP BY activity ORDER BY COUNT(*) DESC, activity')
      .all()
      .map((r) => r.activity),
  );
});

// Tagebuch: Einträge eines Monats (ohne Eintrag fehlt der Tag)
app.get('/api/diary/month/:month', (req, res) => {
  const { month } = req.params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ error: 'month im Format YYYY-MM erforderlich' });
  }
  const dates = db.prepare('SELECT date FROM diary_entries WHERE date LIKE ? ORDER BY date').all(`${month}-%`);
  res.json(dates.map((d) => readDiary(d.date)));
});

app.get('/api/diary/:date', (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: 'date im Format YYYY-MM-DD erforderlich' });
  const entry = readDiary(date);
  if (!entry) return res.status(404).json({ error: 'Kein Eintrag für dieses Datum' });
  res.json(entry);
});

app.delete('/api/diary/:date', (req, res) => {
  const { date } = req.params;
  if (!isDate(date)) return res.status(400).json({ error: 'date im Format YYYY-MM-DD erforderlich' });
  db.prepare('DELETE FROM diary_entries WHERE date = ?').run(date); // Activities und Symptome per CASCADE
  res.json({ date, deleted: true });
});


// Fehler der API immer als JSON { error } ausliefern
app.use('/api', (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Ungültiges JSON' });
  console.error(err);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React Router
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));