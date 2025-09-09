import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FaGithub, FaRandom, FaTimes } from "react-icons/fa";

/* ───────────────── data ───────────────── */
type Project = {
  title: string;
  description: string;
  link: string; // https ссылка на репу
  tech: string[];
  image?: string;
};

const baseProjects: Project[] = [
  {
    title: "pearde.lol",
    description:
      "Personal site with Linux/terminal vibes, ASCII UI, animations, and more.",
    link: "https://github.com/pearde/pearde.lol",
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    image: "/projects/pearde-lol.png",
  },
  {
    title: "PicShareHub",
    description:
      "Minimal image sharing web app built with Express, EJS and local storage.",
    link: "https://github.com/BeanDx/PicShareHub",
    tech: ["Node.js", "Express", "EJS", "File Uploads"],
    image: "/projects/pic-share.png",
  },
  {
    title: "gitfetch",
    description: "A fastfetch-inspired image-based neofetch clone.",
    link: "https://github.com/BeanDx/GitFetchCSharp",
    tech: ["C#", "CLI", "PNG rendering"],
    image: "/projects/gitfetch.png",
  },
  {
    title: "web-chat-soket-io",
    description: "Real-time chat app using socket.io, Express and vanilla JS.",
    link: "https://github.com/BeanDx/web-chat-soket-io",
    tech: ["Node.js", "Socket.io", "Express", "HTML/CSS/JS"],
    image: "/projects/web-chat.png",
  },
];

/* ──────────────── utils ──────────────── */
const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ─────────────── tilt card ───────────── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useTransform(my, (v) => (v - 0.5) * -8);
  const rotateY = useTransform(mx, (v) => (v - 0.5) * 8);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    animate(mx, 0.5, { duration: 0.18 });
    animate(my, 0.5, { duration: 0.18 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" as any }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── one card with local toast ─────────── */
function ProjectCard({ proj }: { proj: Project }) {
  const [copied, setCopied] = useState(false);

  const copyClone = async (e: React.MouseEvent) => {
    e.preventDefault();
    const link = proj.link.endsWith(".git") ? proj.link : `${proj.link}.git`;
    const cmd = `git clone ${link}`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <TiltCard className="h-full">
      <motion.a
        href={proj.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="
          relative group bg-white/5 border border-white/10 rounded-2xl p-5
          backdrop-blur-md hover:border-[var(--arch)]/40 transition-colors
          h-full flex flex-col min-h-[340px]
        "
      >
        {/* локальный тост в углу карточки */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute top-3 right-3 bg-black/80 border border-white/10 text-xs px-2 py-1 rounded-md"
            >
              Copied: <span className="opacity-80">git clone …</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200 group-hover:text-white">
            {proj.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyClone}
              className="text-xs bg-white/10 hover:bg-white/15 border border-white/10 rounded-md px-2 py-1"
              title="Copy: git clone <link>"
            >
              clone
            </button>
            <FaGithub className="text-slate-400 group-hover:text-white" size={18} />
          </div>
        </div>

        <p className="text-slate-400 mt-2 text-sm">{proj.description}</p>

        {proj.image && (
          <div className="relative mt-4 rounded-lg border border-white/10 shadow-md overflow-hidden">
            <div className="pt-[56%]" />
            <img
              src={proj.image}
              alt={`${proj.title} screenshot`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* tags */}
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
          {proj.tech.map((tag) => (
            <span key={tag} className="bg-white/10 text-xs px-2 py-0.5 rounded-md text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </motion.a>
    </TiltCard>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(baseProjects);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // только хоткей для быстрого фокуса поиска
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        (document.getElementById("projects-search") as HTMLInputElement | null)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    baseProjects.forEach((p) => p.tech.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const okQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      const okT = activeTags.length === 0 || activeTags.every((t) => p.tech.includes(t));
      return okQ && okT;
    });
  }, [projects, query, activeTags]);

  return (
    <section className="space-y-8 mt-16 md:mt-20">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <h1 className="text-3xl font-bold text-slate-100 select-none">Projects</h1>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              id="projects-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search… (press /)"
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none
                         focus:border-[var(--arch)]/50 placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10"
                aria-label="Clear"
              >
                <FaTimes size={12} className="text-slate-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setProjects((p) => shuffle(p))}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-sm hover:border-[var(--arch)]/50"
            title="Shuffle"
          >
            <FaRandom className="opacity-80" /> Shuffle
          </button>
        </div>
      </div>

      {/* tag filter */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((t) => {
          const active = activeTags.includes(t);
          return (
            <button
              key={t}
              onClick={() =>
                setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
              }
              className={`px-2 py-1 rounded-md text-xs border ${
                active
                  ? "bg-[var(--arch)]/20 border-[var(--arch)]/40 text-[var(--arch)]"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          );
        })}
        {activeTags.length > 0 && (
          <button
            onClick={() => setActiveTags([])}
            className="px-2 py-1 rounded-md text-xs bg-white/5 border border-white/10 hover:bg-white/10"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-xs text-slate-500">{filtered.length} / {projects.length}</span>
      </div>

      {/* grid + анимация появления/ухода карточек */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((proj) => (
            <motion.div
              key={proj.title}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ProjectCard proj={proj} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}
