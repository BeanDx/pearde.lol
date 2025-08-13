import { motion } from "framer-motion";
import type { Variants, TargetAndTransition, Transition } from "framer-motion";
import { useTranslation } from "react-i18next";

type Item = {
  period: string;
  title: string;
  desc?: string;
};

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

// волна для анимируемых букв
const wave = (i: number): TargetAndTransition => ({
  y: [0, -4, 0],
  transition: {
    delay: i * 0.1,
    repeat: Infinity,
    repeatType: "loop",
    duration: 1.2,
    ease: EASE,
  } as Transition,
});

const wavyVariants: Variants = {
  initial: { y: 0 },
  animate: wave,
};

export default function Timeline() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  // Берём айтемы прямо из i18n
  const items = t("timeline.items", { returnObjects: true }) as Item[];

  // Заголовок: статичная + анимируемая часть
  let staticPart = "";
  let animatedPart = "";
  if (lang === "ru") {
    staticPart = "Тайм";
    animatedPart = "лайн";
  } else if (lang === "de") {
    staticPart = "Zeit";
    animatedPart = "leiste";
  } else {
    staticPart = "Time";
    animatedPart = "line";
  }

  return (
    <section className="space-y-6">
      {/* Заголовок с wavy-эффектом только на animatedPart */}
      <h2 className="text-2xl md:text-3xl font-semibold flex">
        {staticPart}
        {animatedPart.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
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
          {items.map((it, i) => (
            <motion.li
              key={`${lang}-${it.period}-${it.title}`} // ключ привязан к языку — корректный ремоунт при смене языка
              className="relative pl-12 md:pl-16"
              variants={itemVariants}
              custom={i}
              initial="hidden"
              whileInView="show"                     // ← вместо useInView()
              viewport={{ amount: 0.35, once: false, margin: "-10% 0px -10% 0px" }}
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
          ))}
        </ul>
      </div>
    </section>
  );
}
