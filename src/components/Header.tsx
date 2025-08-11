import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/rices", label: "Rices" },
  { to: "/contacts", label: "Contacts" },
];

function ArchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M128 0c-16 40-26 67-44 106c11 12 26 19 44 19c-2-6-6-14-9-20c9 9 21 19 36 24c-9-20-18-41-27-61c13 30 30 66 60 110c-11-5-23-9-34-13c5 10 10 20 16 30c-14-8-29-16-44-21c-19 8-39 15-58 23c26-43 45-79 60-110C156 67 144 40 128 0Z"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  const tab = (active: boolean) =>
    "px-4 py-2.5 rounded-md text-base font-medium transition-colors " +
    (active
      ? "text-[var(--arch)] bg-white/5 ring-1 ring-[color:var(--arch)]/40"
      : "text-slate-300 hover:text-white hover:bg-white/5");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"> {/* Увеличена высота шапки */}
        {/* бренд → домой */}
        <NavLink
          to="/"
          end
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3 text-slate-200 hover:text-white"
          aria-label="Go home"
        >
          <span className="text-[1.25rem] font-semibold">pearde</span> {/* Увеличен размер шрифта */}
          <span className="text-slate-400">×</span>
          <ArchIcon className="h-[22px] w-[22px] text-[var(--arch)] group-hover:drop-shadow-[0_0_6px_#1793D1]" />
          <span className="text-slate-400">=</span>
          <span className="text-rose-400 group-hover:animate-pulse">♥</span>
          <span className="hidden sm:inline text-slate-400 text-sm ml-1">.lol</span>
        </NavLink>

        {/* десктоп меню */}
        <nav className="hidden md:flex gap-4"> {/* Увеличены промежутки между элементами меню */}
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => tab(isActive)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* бургер */}
        <button
          className="md:hidden text-slate-300 text-xl leading-none"
          onClick={() => setOpen((s) => !s)}
          aria-label="menu"
        >
          ☰
        </button>
      </div>

      {/* моб. меню */}
      {open && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => tab(isActive)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
