import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { FaHome, FaUtensils, FaPhone } from "react-icons/fa";
import LangSelect from "../components/ui/LangSelect";
import { useTranslation } from "react-i18next";

type LinkItem = {
  to: string;
  labelKey: string; // ключ для i18n
  end?: boolean;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
};

const links: LinkItem[] = [
  { to: "/",        labelKey: "nav.home",     end: true, Icon: FaHome },
  { to: "/rices",   labelKey: "nav.rices",               Icon: FaUtensils },
  { to: "/contacts",labelKey: "nav.contacts",            Icon: FaPhone },
];

const MotionNavLink = motion(NavLink);

const tabVariants: Variants = {
  rest:  { rotate: 0, y: 0, scale: 1 },
  hover: { rotate: -2, y: -1, scale: 1.02 },
};

const tabSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 28,
  mass: 0.6,
};

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
  const { t } = useTranslation();

  const tab = (active: boolean) =>
    "inline-flex items-center gap-2 leading-none transform-gpu origin-center will-change-transform " +
    "px-4 py-2.5 rounded-md text-base font-medium transition-colors " +
    (active
      ? "text-[var(--arch)] bg-white/5 ring-1 ring-[color:var(--arch)]/40"
      : "text-slate-300 hover:text-white hover:bg-white/5");

  return (
    <header className="fixed top-0 inset-x-0 z-[999] border-b border-white/10
      bg-[#0f172a]/70 backdrop-blur-md supports-[backdrop-filter:blur(0)]:bg-[#0f172a]/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* бренд */}
        <motion.div
          className="select-none"
          whileHover={{ rotate: -1, y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <NavLink
            to="/"
            end
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-slate-200 hover:text-white"
            aria-label="Go home"
          >
            <span className="text-[1.25rem] font-semibold">pearde</span>
            <span className="text-slate-400">×</span>
            <ArchIcon className="h-[22px] w-[22px] text-[var(--arch)] group-hover:drop-shadow-[0_0_6px_#1793D1]" />
            <span className="text-slate-400">=</span>
            <span className="text-rose-400 group-hover:animate-pulse">♥</span>
            <span className="hidden sm:inline text-slate-400 text-sm ml-1">.lol</span>
          </NavLink>
        </motion.div>

        {/* десктоп меню + селектор */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-4">
            {links.map((l) => {
              const Icon = l.Icon;
              return (
                <MotionNavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => tab(isActive)}
                  initial={false}
                  animate="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  variants={tabVariants}
                  transition={tabSpring}
                >
                  <Icon className="shrink-0 opacity-80" size={16} />
                  <span>{t(l.labelKey)}</span>
                </MotionNavLink>
              );
            })}
          </nav>

          {/* селектор языка */}
          <LangSelect />
        </div>

        {/* бургер */}
        <motion.button
          className="md:hidden grid place-items-center w-11 h-11 rounded-xl
                     text-slate-200 bg-white/5 active:bg-white/10 relative z-[1001]"
          onClick={() => setOpen((s) => !s)}
          aria-label="menu"
          aria-expanded={open}
          initial={{ rotate: 0 }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ touchAction: "manipulation" }}
        >
          <span className="text-xl leading-none">☰</span>
        </motion.button>
      </div>

      {/* моб. меню — overflow.visible когда открыто, чтобы дропдаун не резался */}
      <motion.div
        className={`md:hidden px-6 flex flex-col gap-2 ${
          open ? "pb-4 overflow-visible" : "pb-0 overflow-hidden"
        }`}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        aria-hidden={!open}
      >
        {links.map((l) => {
          const Icon = l.Icon;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => tab(isActive)}
            >
              <Icon className="shrink-0 opacity-80" size={16} />
              <span>{t(l.labelKey)}</span>
            </NavLink>
          );
        })}

        <LangSelect />
      </motion.div>
    </header>
  );
}
