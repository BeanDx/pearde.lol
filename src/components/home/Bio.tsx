import { motion } from "framer-motion";
import FakeTerminal from "../ui/FakeTerminal";
import { useTranslation } from "react-i18next";

const ASCII_LOGO = String.raw`
    ____  _________    ____  ____  ______
   / __ \/ ____/   |  / __ \/ __ \/ ____/
  / /_/ / __/ / /| | / /_/ / / / / __/   
 / ____/ /___/ ___ |/ _, _/ /_/ / /___   
/_/   /_____/_/  |_/_/ |_/_____/_____/   
`;

const ASCII_PENGUIN = String.raw`
   .--.
  |o_o |
  |:_/ |
 //   \ \
(|     | )
/'\_   _/` + "\\" + `
\___)=(___/
`;

export default function Bio() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto space-y-4">
      {/* Терминал */}
      <FakeTerminal
        prompt="max@archlinux"
        command="fastfetch"
        ascii={ASCII_LOGO}
      >
        <dl
          className="mt-3 grid gap-x-4 gap-y-1 break-words"
          style={{ gridTemplateColumns: "max-content 1fr" }}
        >
          <dt className="text-yellow-300">{t("bio.name")}</dt>
          <dd>Max</dd>

          <dt className="text-yellow-300">{t("bio.age")}</dt>
          <dd>19</dd>

          <dt className="text-yellow-300">{t("bio.location")}</dt>
          <dd>Cologne, Germany</dd>

          <dt className="text-yellow-300">{t("bio.os")}</dt>
          <dd>Arch Linux (bspwm / hyprland / KDE (wayland))</dd>

          <dt className="text-yellow-300">{t("bio.languages")}</dt>
          <dd>C++, C#, JavaScript</dd>

          <dt className="text-yellow-300">{t("bio.info")}</dt>
          <dd className="text-green-300/90 leading-relaxed">
            Frontend enjoyer, React clicker, ex-C# sorcerer, C++ pointer tamer,
            touched Kotlin once and survived. Knows enough code to make things
            work (and sometimes even look pretty).
          </dd>
        </dl>
      </FakeTerminal>

      {/* Пингвин в той же секции, без разрыва фона */}
      <div className="flex flex-col items-center">
        <pre className="whitespace-pre text-emerald-400/80 text-[10px] sm:text-[12px] select-none leading-none">
          {ASCII_PENGUIN}
        </pre>
        <motion.a
          href="#weather"
          initial={{ y: 0, opacity: 0.6 }}
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-1 inline-block text-sm sm:text-base text-slate-400 hover:text-slate-200 transition-colors"
        >
          ↓ scroll below 
        </motion.a>
      </div>
    </section>
  );
}
