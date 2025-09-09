import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import TiltCard from "../ui/TildCard";
import type { Project } from "../../lib/projectsData";

export default function ProjectCard({ proj }: { proj: Project }) {
  const [copied, setCopied] = useState(false);

  const copyClone = async (e: React.MouseEvent) => {
    e.preventDefault();
    const link = proj.link.endsWith(".git") ? proj.link : `${proj.link}.git`;
    const cmd = `git clone ${link}`;
    try {
      await navigator.clipboard.writeText(cmd);
    } finally {
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

        {/* desc */}
        <p className="text-slate-400 mt-2 text-sm">{proj.description}</p>

        {/* preview 16:9 */}
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
