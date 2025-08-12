import { motion, useInView } from "framer-motion";
import type { Variants, TargetAndTransition, Transition } from "framer-motion";
import { useRef } from "react";

type Item = {
  period: string;
  title: string;
  desc?: string;
};

const items: Item[] = [
  { period: "2020",           title: "<h1>HTML + CSS</h1>", desc: "First spaghetti and pixel-perfect obsession." },
  { period: "2020 — Forever", title: 'echo "Linux"', desc: "Arch btw. Ricing, window managers, dotfiles — been living here since." },
  { period: "2020 — Present", title: 'console.log("React, tailwind, typescript, js, expressjs, mangoDB")', desc: "SPA wizardry, animations, routing, state, production builds." },
  { period: "2023 — 2024",    title: 'std::cout << "C++" << std::endl;', desc: "Pointers, memory, pain — but blazing fast." },
];

// общая кривая
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// анимация появления айтемов
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: (i: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.06, duration: 0.45, ease: EASE },
  }),
};

// волна для "line" — типобезопасно
const wave = (i: number): TargetAndTransition => ({
  y: [0, -4, 0],
  transition: {
    delay: i * 0.1,
    repeat: Infinity,
    repeatType: "loop",         // <— конкретный литерал
    duration: 1.2,
    ease: EASE,                 // <— кубик-Безье вместо строки
  } as Transition,
});

const wavyVariants: Variants = {
  initial: { y: 0 },
  animate: wave,
};

export default function Timeline() {
  const wavyText = "line".split("");

  return (
    <section className="space-y-6">
      {/* Заголовок с wavy-эффектом на "line" */}
      <h2 className="text-2xl md:text-3xl font-semibold flex">
        Time
        {wavyText.map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={wavyVariants}
            initial="initial"
            animate="animate"
            className="inline-block text-[var(--arch)]"
          >
            {char}
          </motion.span>
        ))}
      </h2>

      <div className="relative">
        {/* вертикальная светящаяся линия */}
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
              amount: 0.35,
              once: false,
              margin: "-10% 0px -10% 0px",
            });

            return (
              <motion.li
                ref={ref}
                key={it.period + it.title}
                className="relative pl-12 md:pl-16"
                variants={itemVariants}
                custom={i}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
              >
                {/* точка */}
                <span
                  className="absolute left-3 md:left-5 top-2 h-3.5 w-3.5 rounded-full ring-4"
                  style={{
                    background: "var(--arch)",
                    boxShadow: "0 0 12px rgba(23,147,209,.65)",
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                />

                {/* карточка */}
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
