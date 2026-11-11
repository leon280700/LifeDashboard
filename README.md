# Frontend starte
```
cd frontend
npm run dev
```

# Backend starten
```
cd backend
npm run dev
```

# Datenbank in Terminal
Mit DB Verbinden:
`sqlite3 -header -column backend/data/dashboard.db`
Nützliche Befehle darin:
```
.tables                       -- alle Tabellen
.schema goals                 -- Struktur einer Tabelle
SELECT * FROM goals;
SELECT * FROM goal_checks;
.quit
```