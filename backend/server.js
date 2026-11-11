import express from 'express';
import cors from 'cors';
import path from 'path';

const __dirname = import.meta.dirname;

const app = express();
app.use(cors());
app.use(express.json());

// API Route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js' });
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for React Router
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));