import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db.js';

const __dirname = import.meta.dirname;

const app = express();
app.use(cors());
app.use(express.json());


// Tracker: Tages-Eingabe speichern
// Body: { date: "YYYY-MM-DD", checks: { fitness: true, ... }, notes?: string }
app.post('/api/tracker', (req, res) => {
  const { date, checks, notes = '' } = req.body ?? {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || typeof checks !== 'object' || checks === null) {
    return res.status(400).json({ error: 'date (YYYY-MM-DD) und checks erforderlich' });
  }
  const goals = db.prepare('SELECT id, name FROM goals WHERE active = 1').all();
  const upsertCheck = db.prepare(
    'INSERT INTO goal_checks (date, goal_id, achieved) VALUES (?, ?, ?) ON CONFLICT(date, goal_id) DO UPDATE SET achieved = excluded.achieved',
  );
  const upsertNotes = db.prepare(
    'INSERT INTO day_notes (date, notes) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET notes = excluded.notes',
  );
  db.exec('BEGIN');
  try {
    for (const g of goals) upsertCheck.run(date, g.id, checks[g.name] ? 1 : 0);
    upsertNotes.run(date, String(notes));
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  res.status(201).json({ date, saved: goals.length });
});

// Tracker: Eingabe eines Tages lesen
app.get('/api/tracker/:date', (req, res) => {
  const { date } = req.params;
  const rows = db
    .prepare('SELECT g.name, c.achieved FROM goal_checks c JOIN goals g ON g.id = c.goal_id WHERE c.date = ?')
    .all(date);
  const note = db.prepare('SELECT notes FROM day_notes WHERE date = ?').get(date);
  res.json({
    date,
    checks: Object.fromEntries(rows.map((r) => [r.name, !!r.achieved])),
    notes: note?.notes ?? '',
  });
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React Router
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));