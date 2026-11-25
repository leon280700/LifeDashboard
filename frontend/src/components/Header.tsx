import {
  BookOpen,
  ChartLine,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Analyse from "../pages/Analyse";
import Dashboard from "../pages/Dashboard";
import Diary from "../pages/Diary";
import Tracker from "../pages/Tracker";

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tracker", label: "Tracker", icon: ListChecks },
  { to: "/diary", label: "Diary", icon: BookOpen },
  { to: "/analyse", label: "Analyse", icon: ChartLine },
];

const linkBase =
  "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export default function Header() {
  return (
    <BrowserRouter>
      <header className="sticky top-0 z-40 border-b border-neutral-800/70 bg-neutral-950/60 backdrop-blur-md">
        <nav
          aria-label="Hauptnavigation"
          className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2.5"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-blue-500/15 text-blue-100 ring-1 ring-blue-400/30"
                    : "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-100"
                }`
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/analyse" element={<Analyse />} />
      </Routes>
    </BrowserRouter>
  );
}
