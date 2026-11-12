import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db.js';

const __dirname = import.meta.dirname;

const app = express();
app.use(cors());
app.use(express.json());


const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD (lokal)
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');

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
  const list = req.body?.goals;
  if (
    !Array.isArray(list) ||
    list.some((g) => typeof g?.category !== 'string' || !g.category.trim()) ||
    new Set(list.map((g) => g.category)).size !== list.length
  ) {
    return res.status(400).json({ error: 'goals: [{ category, condition }] mit eindeutigen Kategorien erforderlich' });
  }
  const wanted = new Map(list.map((g) => [g.category, String(g.condition ?? '').trim()]));
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
  if (!isDate(date) || typeof checks !== 'object' || checks === null) {
    return res.status(400).json({ error: 'date (YYYY-MM-DD) und checks erforderlich' });
  }
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
    upsertNotes.run(date, String(notes));
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.status(201).json({ date, saved: goals.length });
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


// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React Router
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));