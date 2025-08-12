import { motion, useInView } from "framer-motion";
import type { Variants, TargetAndTransition } from "framer-motion";
import { useRef } from "react";

type Item = {
  period: string;
  title: string;
  desc?: string;
};

// stuff I did + when I did it
const items: Item[] = [
  { period: "2020",           title: "HTML + CSS", desc: "First spaghetti and pixel-perfect obsession." },
  { period: "2020 — Forever", title: "Linux",      desc: "Arch btw. Ricing, window managers, dotfiles — been living here since." },
  { period: "2020 — Present", title: "React",      desc: "SPA wizardry, animations, routing, state, production builds." },
  { period: "2023 — 2024",    title: "C++",        desc: "Pointers, memory, pain — but blazing fast." },
];

// easing curve for the animation
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// how each timeline item should look when hidden / shown
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: (i: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.06, duration: 0.45, ease: EASE },
  }),
};

export default function Timeline() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-semibold">Timeline</h2>

      <div className="relative">
        {/* vertical glowing line down the middle */}
        <div
          className="absolute left-4 md:left-6 top-0 h-full w-px"
          style={{
            background:
              "linear-gradient(to bottom, rgba(23,147,209,0.0), rgba(23,147,209,0.65), rgba(23,147,209,0.0))",
          }}
        />

        <ul className="space-y-6">
          {items.map((it, i) => {
            const ref = useRef<HTMLLIElement | null>(null);

            const inView = useInView(ref, {
              amount: 0.35, // how much of the item has to be visible before we trigger
              once: false,  // we want it to animate both in and out
              margin: "-10% 0px -10% 0px", // tweak trigger zone so it feels snappier
            });

            return (
              <motion.li
                ref={ref}
                key={it.period + it.title}
                className="relative pl-12 md:pl-16"
                variants={itemVariants}
                custom={i}
                initial="hidden"
                animate={inView ? "show" : "hidden"} // collapse when scrolled away
              >
                {/* lil' glowing dot */}
                <span
                  className="absolute left-3 md:left-5 top-2 h-3.5 w-3.5 rounded-full ring-4"
                  style={{
                    background: "var(--arch)",
                    boxShadow: "0 0 12px rgba(23,147,209,.65)",
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                />

                {/* the card itself */}
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm hover:ring-1 hover:ring-[color:var(--arch)]/35 transition">
                  <div className="text-[0.85rem] text-slate-400">{it.period}</div>
                  <div className="mt-0.5 text-lg font-medium text-slate-100">{it.title}</div>
                  {it.desc && (
                    <div className="mt-1.5 text-slate-300/90 text-[0.95rem] leading-relaxed">
                      {it.desc}
                    </div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
