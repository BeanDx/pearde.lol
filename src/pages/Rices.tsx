import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMonitor, FiTag } from "react-icons/fi";

// ---------- Types ----------
// Each rice is a set of screenshots + metadata.
export type Rice = {
  id: string;
  title: string; // e.g. "Hyprland • Catppuccin • Waybar minimal"
  date: string; // ISO date
  env: "Hyprland" | "KDE Plasma" | "i3" | "bspwm" | "Xfce" | "GNOME";
  distro?: "Arch" | "Fedora" | "Ubuntu" | "NixOS" | "Debian" | "Manjaro";
  tags: string[];
  images: string[]; // 1..N screenshots
  notes?: string;
};

// ---------- Data (drop your own here) ----------
const DATA: Rice[] = [
  {
    id: "hypr-250901",
    title: "Hyprland • Arch BTW • Fastfetch vibes",
    date: "2025-09-01",
    env: "Hyprland",
    distro: "Arch",
    tags: ["fastfetch", "waybar", "kitty", "jetbrains-mono", "tiling"],
    images: [
      "/rices/bspwm1.jpg",
      "/rices/hyprland_2025-09-01_2.webp",
      "/rices/hyprland_2025-09-01_3.webp",
    ],
    notes: "Minimal bar, terminal focus, subtle blur.",
  },
  {
    id: "plasma-250820",
    title: "KDE Plasma • Blur + Glow • Latte-ish",
    date: "2025-08-20",
    env: "KDE Plasma",
    distro: "Arch",
    tags: ["kde", "kvantum", "blur", "glow", "floating"],
    images: [
      "/rices/plasma_2025-08-20_1.webp",
      "/rices/plasma_2025-08-20_2.webp",
    ],
  },
  {
    id: "bspwm-240612",
    title: "bspwm • Doomy monochrome • Polybar",
    date: "2024-06-12",
    env: "bspwm",
    distro: "Arch",
    tags: ["polybar", "rofi", "monochrome", "paper"],
    images: ["/rices/bspwm_2024-06-12_1.webp"],
  },
];

// ---------- Utils ----------
const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

// ---------- Left plate (list item) ----------
function Plate({ r, active, onClick }: { r: Rice; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={[
        "w-full overflow-hidden rounded-xl border text-left transition",
        active
          ? "border-sky-400/40 bg-sky-400/10"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 p-2">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
          <img src={r.images[0]} alt={r.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 ring-1 ring-white/10">
              <FiMonitor className="h-3 w-3" /> {r.env}
            </span>
            {r.distro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 ring-1 ring-white/10">
                🐧 {r.distro}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ---------- Main Page ----------
export default function Rices() {
  const [all] = useState<Rice[]>(DATA);
  const [activeId, setActiveId] = useState<string>(all[0]?.id ?? "");
  const active = useMemo(() => all.find((r) => r.id === activeId) ?? all[0], [all, activeId]);
  const [idx, setIdx] = useState(0);

  // Reset image index when switching rice
  useEffect(() => setIdx(0), [activeId]);

  function prev() {
    if (!active) return;
    setIdx((i) => (i - 1 + active.images.length) % active.images.length);
  }
  function next() {
    if (!active) return;
    setIdx((i) => (i + 1) % active.images.length);
  }

  // Arrow keys for gallery
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active]);

  return (
    <section className="mt-16 md:mt-20">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight">Rices</h1>
          <p className="mt-1 text-slate-300/90">Minimal master–detail view. Left = plates, right = preview.</p>
        </header>

        {/* Two-column layout */}
        <div className="grid gap-4 lg:grid-cols-[360px_1fr] md:grid-cols-[340px_1fr]">
          {/* Left column: plates */}
          <aside className="sticky top-16 md:top-20 h-fit max-h-[calc(100vh-140px)] overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2">
            <div className="flex flex-col gap-2">
              {all.map((r) => (
                <Plate key={r.id} r={r} active={r.id === activeId} onClick={() => setActiveId(r.id)} />
              ))}
            </div>
          </aside>

          {/* Right column: big preview */}
          <main className="rounded-2xl border border-white/10 bg-white/5 p-3">
            {active && (
              <motion.div layout className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
                    <FiMonitor className="h-3 w-3" /> {active.env}
                  </span>
                  {active.distro && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">
                      🐧 {active.distro}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-slate-400">{formatDate(active.date)}</span>
                </div>

                <h2 className="text-xl font-semibold text-white">{active.title}</h2>

                <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={active.images[idx]}
                    alt={active.title}
                    className="block h-auto max-h-[70vh] w-auto max-w-full object-contain"
                    loading="eager"
                  />
                  {active.images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur hover:bg-white/10"
                        aria-label="Previous"
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur hover:bg-white/10"
                        aria-label="Next"
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {active.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-200 ring-1 ring-white/10"
                    >
                      <FiTag className="h-3 w-3" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
