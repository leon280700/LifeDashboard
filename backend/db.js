import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DB_PATH ?? path.join(import.meta.dirname, 'data', 'dashboard.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(path.join(import.meta.dirname, 'schema.sql'), 'utf8'));

// Start-Ziele (entsprechen GoalTrackerCategories im Frontend)
const insertGoal = db.prepare('INSERT OR IGNORE INTO goals (name) VALUES (?)');
for (const name of ['fitness', 'mental', 'diet', 'education', 'career']) {
  insertGoal.run(name);
}

export default db;
