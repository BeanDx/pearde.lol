import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  /** Весь твой сайт сюда */
  children: React.ReactNode;
  /**
   * Режим:
   * - "fixed" — всегда держим сплэш ровно duration мс (рекомендуется)
   * - "min"   — минимум duration мс + ждём window.load (если вдруг страница реально грузится)
   */
  mode?: "fixed" | "min";
  /** Длительность показа сплэша в мс */
  duration?: number;
  /** Показывать каждый визит? Если false — только 1-й раз (через localStorage) */
  everyVisit?: boolean;
  /** Поменяешь ключ — сплэш снова покажется всем */
  versionKey?: string;
};

const ASCII = [
  "         .--.",
  "        |o_o |",
  "        |:_/ |",
  "       //   \\\\ \\\\",
  "      (|     | )",
  "     /'\\\\_   _/`\\\\",
  "     \\\\___)=(___/",
].join("\n");

const BOOT_LINES = [
  "[ OK ] init kernel modules…",
  "[ OK ] mount /home…",
  "[ OK ] start network manager…",
  "[ OK ] start display server (Wayland)…",
  "[ OK ] launching pearde.lol…",
];

export default function SplashPenguin({
  children,
  mode = "fixed",
  duration = 1800,
  everyVisit = false,
  versionKey = "tux_gate_v3",
}: Props) {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1
  const [lineIdx, setLineIdx] = useState(0);

  // показывать сплэш вообще или нет (1-й визит vs каждый визит)
  const shouldShow = useMemo(() => {
    if (everyVisit) return true;
    try { return !localStorage.getItem(versionKey); } catch { return true; }
  }, [everyVisit, versionKey]);

  // Основная логика: держим сплэш нужное время, сайт пока НЕ рендерим
  useEffect(() => {
    if (!shouldShow) { setShowSplash(false); return; }

    // блочим скролл на время сплэша
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");

    const start = performance.now();
    let raf = 0;
    let loaded = document.readyState === "complete";

    const onLoad = () => { loaded = true; };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.max(0, Math.min(1, elapsed / duration));
      setProgress(p);

      const step = Math.floor(p * BOOT_LINES.length);
      setLineIdx(Math.min(BOOT_LINES.length - 1, step));

      const timeDone = p >= 1;

      if (mode === "fixed") {
        if (timeDone) {
          try { if (!everyVisit) localStorage.setItem(versionKey, "1"); } catch {}
          setShowSplash(false);
          return;
        }
      } else {
        // "min": ждём минимум времени И (по возможности) onload
        if (timeDone && loaded) {
          try { if (!everyVisit) localStorage.setItem(versionKey, "1"); } catch {}
          setShowSplash(false);
          return;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [shouldShow, mode, duration, everyVisit, versionKey]);

  // вернём скролл когда всё скрыли
  useEffect(() => {
    if (!showSplash) {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    }
  }, [showSplash]);

  // Пока сплэш открыт — детей НЕ рендерим вообще (жёсткий гейт)
  if (showSplash && shouldShow) {
    return (
      <>
        <SplashOverlay progress={progress} line={BOOT_LINES[lineIdx]} />
        {/* children не монтируем */}
      </>
    );
  }

  // Сплэш закрыт — рендерим сайт
  return <>{children}</>;
}

/* ===== ВИЗУАЛ СПЛЭША (в том же файле, чтобы было «в одном») ===== */
function SplashOverlay({ progress, line }: { progress: number; line: string }) {
  const node = (
    <AnimatePresence>
      <motion.div
        key="penguin-splash"
        className="fixed inset-0 z-[9999] grid place-items-center bg-[#0b1220]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        role="status"
        aria-label="Loading"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0.95 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="mx-6"
        >
          <pre
            className="font-mono text-slate-200 text-sm sm:text-base leading-[1.15] whitespace-pre select-none
                       [text-shadow:_0_0_12px_rgba(23,147,209,0.25)]"
            aria-hidden="true"
          >
{ASCII}
          </pre>

          <div className="mt-4 font-mono text-xs sm:text-sm text-slate-300/90">
            <div className="min-h-[1.2em]">{line}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="opacity-70">booting tux…</span>
              <div className="inline-block w-28 sm:w-40 h-[3px] bg-slate-700/70 rounded relative overflow-hidden">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-[var(--arch,#1793D1)]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                  transition={{ type: "tween", ease: "linear", duration: 0 }}
                />
              </div>
              <span className="opacity-60 tabular-nums">{Math.round(progress * 100)}%</span>
              <Blink />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
  return createPortal(node, document.body);
}

function Blink() {
  return (
    <motion.span
      className="inline-block w-2 h-4 bg-slate-300 ml-1"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    />
  );
}
