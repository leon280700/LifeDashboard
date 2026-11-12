import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Analyse from "../pages/Analyse";
import Diary from "../pages/Diary";
import Tracker from "../pages/Tracker";
import Dashboard from "../pages/Dashboard";

export default function Header() {
  return (
    <div className="py-2 px-2">
      <BrowserRouter>
        <nav className="flex gap-4 [&_a]:text-sky-400 [&_a]:underline hover:[&_a]:text-sky-300">
          <Link to="/">Dashboard</Link>
          <Link to="/tracker">Tracker</Link>
          <Link to="/diary">Diary</Link>
          <Link to="/analyse">Analyse</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/analyse" element={<Analyse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
