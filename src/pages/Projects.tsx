import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "../components/projects/ProjectCard";
import Toolbar from "../components/projects/Toolbar";
import { baseProjects, type Project } from "../lib/projectsData";
import { shuffle } from "../lib/utils";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(baseProjects);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

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
      <Toolbar
        query={query}
        setQuery={setQuery}
        allTags={allTags}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        onShuffle={() => setProjects((p) => shuffle(p))}
      />

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
