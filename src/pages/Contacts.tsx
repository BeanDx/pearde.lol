import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTelegramPlane,
  FaEnvelope,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaGithub,
} from "react-icons/fa";

type Contact = {
  label: string;
  value: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  copyText: string;
  wide?: boolean;
};

const contacts: Contact[] = [
  {
    label: "Telegram",
    value: "@Pear_de",
    href: "https://t.me/Pear_de",
    Icon: FaTelegramPlane,
    copyText: "@Pear_de",
  },
  {
    label: "GitHub",
    value: "github.com/BeanDx",
    href: "https://github.com/BeanDx",
    Icon: FaGithub,
    copyText: "https://github.com/BeanDx",
  },
  {
    label: "Email",
    value: "pearde@proton.me",
    href: "mailto:pearde@proton.me",
    Icon: FaEnvelope,
    copyText: "pearde@proton.me",
    wide: true,
  },
];

type Ripple = { id: number; x: number; y: number };
type Confetti = { id: number; x: number; y: number; dx: number; dy: number; r: number; s: number };

const useHaptic = () => (navigator.vibrate ? (ms: number) => navigator.vibrate(ms) : () => {});

/* Card with spotlight, ripple, confetti, long-press copy */
function ContactCard({ c }: { c: Contact }) {
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const longTimer = useRef<number | null>(null);
  const longTriggered = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const haptic = useHaptic();

  // Move spotlight with pointer (no re-renders).
  const onPointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current || !spotRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    lastPointer.current = { x, y };
    spotRef.current.style.setProperty("--x", `${x}px`);
    spotRef.current.style.setProperty("--y", `${y}px`);
  };

  // Visual click ripple.
  const spawnRipple = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples((arr) => [...arr, { id, x, y }]);
    window.setTimeout(() => setRipples((arr) => arr.filter((r) => r.id !== id)), 560);
  };

  // Confetti explosion around (x,y).
  const spawnConfetti = (x: number, y: number) => {
    const N = 12;
    const items: Confetti[] = Array.from({ length: N }).map((_, i) => {
      const ang = (Math.PI * 2 * i) / N + Math.random() * 0.6;
      const dist = 60 + Math.random() * 60;
      return {
        id: Date.now() + i + Math.random(),
        x,
        y,
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist,
        r: (Math.random() - 0.5) * 140,
        s: 0.6 + Math.random() * 0.7,
      };
    });
    setConfetti((prev) => [...prev, ...items]);
    window.setTimeout(
      () => setConfetti((prev) => prev.filter((k) => !items.find((i) => i.id === k.id))),
      920
    );
  };

  // Copy helper + visuals.
  const doCopy = async (clientX?: number, clientY?: number) => {
    try {
      await navigator.clipboard.writeText(c.copyText);
    } finally {
      setCopied(true);
      haptic(10);
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        const x = clientX !== undefined ? clientX - r.left : (lastPointer.current?.x ?? r.width / 2);
        const y = clientY !== undefined ? clientY - r.top : (lastPointer.current?.y ?? r.height / 2);
        spawnConfetti(x, y);
      }
      window.setTimeout(() => setCopied(false), 1200);
    }
  };

  // Long-press to copy on touch.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    lastPointer.current = { x, y };
    spawnRipple(x, y);
    longTriggered.current = false;
    longTimer.current = window.setTimeout(() => {
      longTriggered.current = true;
      doCopy(e.clientX, e.clientY);
    }, 450);
  };

  const onPointerUp = () => {
    if (longTimer.current) {
      clearTimeout(longTimer.current);
      longTimer.current = null;
    }
  };

  // Cancel navigation after long-press copy.
  const onClick = (e: React.MouseEvent) => {
    if (longTriggered.current) {
      e.preventDefault();
      longTriggered.current = false;
    }
  };

  return (
    <motion.a
      ref={cardRef}
      href={c.href}
      target={c.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={onClick}
      className="relative group block rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md overflow-hidden"
      style={{ touchAction: "manipulation" }}
    >
      {/* Spotlight (blur + glow) following the pointer */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{
          maskImage:
            "radial-gradient(180px 180px at var(--x) var(--y), #000 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(180px 180px at var(--x) var(--y), #000 30%, transparent 70%)",
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 backdrop-blur-[8px]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(140px 140px at var(--x) var(--y), rgba(23,147,209,.25), transparent 60%)",
          }}
        />
      </div>

      {/* Ripples */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: r.x,
              top: r.y,
              width: 8,
              height: 8,
              transform: "translate(-50%, -50%)",
              filter: "blur(0.3px)",
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 20, opacity: 0 }}
            transition={{ duration: 0.56, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0">
        {confetti.map((k) => (
          <motion.div
            key={k.id}
            className="absolute"
            initial={{ x: k.x, y: k.y, rotate: 0, opacity: 1, scale: k.s }}
            animate={{ x: k.x + k.dx, y: k.y + k.dy, rotate: k.r, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div
              className="w-1.5 h-1.5"
              style={{
                background:
                  Math.random() > 0.5
                    ? "rgba(23,147,209,.9)"
                    : "rgba(255,255,255,.85)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Local toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/80 px-2 py-1 text-xs"
          >
            copied
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        {/* Icon micro spring */}
        <motion.div
          className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/10"
          whileHover={{ rotate: -2, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <c.Icon size={18} className="text-slate-200" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-100">{c.label}</h3>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              open
            </span>
          </div>

          <p className="mt-1 truncate text-slate-400">{c.value}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (!cardRef.current) return;
                const r = cardRef.current.getBoundingClientRect();
                spawnRipple(e.clientX - r.left, e.clientY - r.top);
                await doCopy(e.clientX, e.clientY);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 active:scale-[.98] transition"
              title="Copy to clipboard"
            >
              {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>

            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 group-hover:bg-white/10 transition">
              Open <FaExternalLinkAlt size={11} className="opacity-80" />
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Contacts() {
  const [toast, setToast] = useState<string | null>(null);

  // Keyboard shortcuts: T — open Telegram, G — open GitHub, E — copy email.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "t") window.open("https://t.me/Pear_de", "_blank", "noopener,noreferrer");
      if (k === "g") window.open("https://github.com/BeanDx", "_blank", "noopener,noreferrer");
      if (k === "e") {
        navigator.clipboard.writeText("pearde@proton.me").then(() => {
          setToast("Copied: pearde@proton.me");
          window.setTimeout(() => setToast(null), 1200);
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="mt-16 md:mt-20 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
        <h1 className="text-3xl font-bold text-slate-100">Contacts</h1>
        <p className="text-xs sm:text-sm text-slate-500">Tap/hold to copy</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contacts.map((c) => (
          <div key={c.label} className={c.wide ? "md:col-span-2" : ""}>
            <ContactCard c={c} />
          </div>
        ))}
      </div>

      {/* Cheatsheet */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
        <div className="font-mono">
          <div className="opacity-70"># quick</div>
          <div>
            tg:&nbsp;<span className="text-slate-200">t.me/Pear_de</span> &nbsp;(press{" "}
            <span className="text-slate-300">T</span>)
          </div>
          <div>
            gh:&nbsp;<span className="text-slate-200">github.com/BeanDx</span> &nbsp;(press{" "}
            <span className="text-slate-300">G</span>)
          </div>
          <div>
            mail:&nbsp;<span className="text-slate-200">pearde@proton.me</span> &nbsp;(press{" "}
            <span className="text-slate-300">E</span>)
          </div>
        </div>
      </div>

      {/* Page-level toast for hotkeys */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-black/80 px-3 py-1.5 text-sm text-slate-200"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
