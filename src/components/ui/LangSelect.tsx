import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type LangCode = "en" | "de" | "ru";
type Lang = { code: LangCode; label: string; flag: ReactNode };

/* Free Russia [svg]) */
function FreeRussiaFlag({ className = "h-4 w-6 rounded-sm ring-1 ring-black/10 overflow-hidden" }) {
  return (
    <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
      <rect x="0" y="0" width="3" height="2" fill="#ffffff" />
      <rect x="0" y={2 / 3} width="3" height={2 / 3} fill="#2f5aff" />
    </svg>
  );
}

const LANGS: Lang[] = [
  { code: "en", label: "English",  flag: <span className="text-base">🇬🇧</span> },
  { code: "de", label: "Deutsch",  flag: <span className="text-base">🇩🇪</span> },
  { code: "ru", label: "Русский",  flag: <FreeRussiaFlag /> },
];

export default function LangSelect() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage as LangCode) ?? "en";

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [cursor, setCursor] = useState(
    Math.max(0, LANGS.findIndex((l) => l.code === current))
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);


  useEffect(() => {
    if (open) setCursor(Math.max(0, LANGS.findIndex((l) => l.code === current)));
  }, [open, current]);

  const activeLang = useMemo(
    () => LANGS.find((l) => l.code === current) ?? LANGS[0],
    [current]
  );

  const change = async (lng: LangCode) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    document.documentElement.lang = lng;
    setOpen(false);
    btnRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % LANGS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + LANGS.length) % LANGS.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = LANGS[cursor];
      if (sel) change(sel.code);
    }
  };

  return (
    <div ref={rootRef} className="relative inline-block text-sm">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="flex items-center gap-2 rounded-xl border px-3 py-1.5
                   hover:bg-black/5 dark:hover:bg-white/5 border-white/10 text-slate-200"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        {activeLang.flag}
        <span className="uppercase tracking-wide">{activeLang.code}</span>
        <motion.span
          aria-hidden
          className="inline-block"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 600, damping: 35, mass: 0.5 }}
            className="absolute left-0 top-full z-[1002] mt-1 w-44 overflow-hidden rounded-xl border
                       bg-white/90 backdrop-blur-md shadow-xl dark:bg-neutral-900/90 border-white/10"
            role="listbox"
            aria-label="Language"
            onKeyDown={onKeyDown}
          >
            {LANGS.map((l, i) => {
              const active = l.code === current;
              const focused = i === cursor;
              return (
                <motion.button
                  key={l.code}
                  role="option"
                  aria-selected={active}
                  onClick={() => change(l.code)}
                  className={`relative flex w-full items-center gap-2 px-3 py-2 text-left
                              hover:bg-black/5 dark:hover:bg-white/5
                              ${active ? "font-medium" : ""}`}
                  initial={false}
                >
                  {l.flag}
                  <span className="flex-1">{l.label}</span>

                  <motion.span
                    initial={false}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : -6 }}
                  >
                    ✓
                  </motion.span>

                  {focused && (
                    <motion.span
                      layoutId="lang_focus_ring"
                      className="pointer-events-none absolute inset-x-2 -z-10 h-8 rounded-lg
                                 bg-black/5 dark:bg-white/5"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
