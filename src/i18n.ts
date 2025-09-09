import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        common: {
            // header 
            nav: { 
                home: "Home", 
                rices: "Rices", 
                contacts: "Contacts",
                projects: "Projects"
            },

            // bio component
            bio: {
                name: "Name",
                nameValue: "Max",

                age: "Age",
                location: "Location",
                os: "OS",
                languages: "Languages",

                info: "Info",
                infoValue:
                    "Frontend enjoyer, React clicker, ex-C# sorcerer, C++ pointer tamer, touched Kotlin once and survived. Knows enough code to make things work (and sometimes even look pretty).",

                scrollBelow: "↓ Scroll Below",
            },

            // weather terminal
            weather_term: {
                uptime: "Uptime",
            },

            // timeline
            timeline: {
                title: "Timeline",
                items: [
                    {
                        period: "2020",
                        title: "<h1>HTML + CSS</h1>",
                        desc: "First spaghetti and pixel-perfect obsession."
                    },
                    {
                        period: "2020 — Forever",
                        title: 'echo "Linux"',
                        desc: "Arch btw. Ricing, window managers, dotfiles — been living here since."
                    },
                    {
                        period: "2020 — Present",
                        title: 'console.log("React, tailwind, typescript, js, expressjs, mangoDB")',
                        desc: "SPA wizardry, animations, routing, state, production builds."
                    },
                    {
                        period: "2023 — 2024",
                        title: 'std::cout << "C++" << std::endl;',
                        desc: "Pointers, memory, pain — but blazing fast."
                    }
                ]
            }
        },
    },
    de: {
        common: {
            // header 
            nav: { 
                home: "Start", 
                rices: "Rices", 
                contacts: "Kontakte",
                projects: "Projekte"
            },

            // bio component
            bio: {
                name: "Name",
                nameValue: "Max",

                age: "Alter",
                location: "Ort",
                os: "Betriebssystem",
                languages: "Sprachen",

                info: "Info",
                infoValue:
                    "Frontend-Liebhaber, React-Klicker, Ex-C#-Zauberer, C++-Pointer-Bändiger, hat einmal Kotlin angefasst und überlebt. Kennt genug Code, damit alles funktioniert (und manchmal sogar hübsch aussieht).",

                scrollBelow: "↓ Scrollen Sie nach unten",
            },

            // weather terminal
            weather_term: {
                uptime: "Betriebszeit",
            },

            // timeline
            timeline: {
                title: "Zeitleiste",
                items: [
                    {
                        period: "2020",
                        title: "<h1>HTML + CSS</h1>",
                        desc: "Erste Spaghetti-Struktur und Pixel-Perfektion."
                    },
                    {
                        period: "2020 — Für immer",
                        title: 'echo "Linux"',
                        desc: "Arch übrigens. Ricing, Window-Manager, Dotfiles — seitdem hier zuhause."
                    },
                    {
                        period: "2020 — Heute",
                        title: 'console.log("React, tailwind, typescript, js, expressjs, mangoDB")',
                        desc: "SPA-Zauberei, Animationen, Routing, State-Management, Produktionsbuilds."
                    },
                    {
                        period: "2023 — 2024",
                        title: 'std::cout << "C++" << std::endl;',
                        desc: "Pointer, Speicher, Schmerz — aber verdammt schnell."
                    }
                ]
            }
        },
    },
    ru: {
        common: {
            // header 
            nav: { 
                home: "Хоум", 
                rices: "Райсы", 
                contacts: "Связь",
                projects: "Проекты"
            },

            // bio component
            bio: {
                name: "Имя",
                nameValue: "Макс",

                age: "Возраст",
                location: "Локация",
                os: "ОС",
                languages: "Языки",

                info: "Инфа",
                infoValue:
                    "Фронтендный кайфожор, кликер по React до мозолей, бывший маг C#, дрессировщик указателей в C++, однажды лапнул Kotlin и чудом не отъехал. Кода знает ровно столько, чтобы всё работало (а иногда даже не стыдно показать =)",

                scrollBelow: "↓ Вниз",
            },

            // weather terminal
            weather_term: {
                uptime: "Время работы",
            },

            // timeline
            timeline: {
                title: "Таймлайн",
                items: [
                    {
                        period: "2020",
                        title: "<h1>HTML + CSS</h1>",
                        desc: "Первый опыт варки кода-лапши и пиксельного дрочева."
                    },
                    {
                        period: "2020 — Навсегда <3",
                        title: 'echo "Linux"',
                        desc: "Arch btw. Райсинг, тайлинг, дотфайлы — живу тут с тех пор."
                    },
                    {
                        period: "2020 — Настоящее время",
                        title: 'console.log("React, tailwind, typescript, js, expressjs, mangoDB")',
                        desc: "SPA-магия, анимации, роутинг, стейт, продакшн-сборки."
                    },
                    {
                        period: "2023 — 2024",
                        title: 'std::cout << "C++" << std::endl;',
                        desc: "Указатели, память, боль — но летает как ракета."
                    }
                ]
            }
        },
    },
} as const;

const saved = (typeof window !== "undefined" && localStorage.getItem("lng")) as
    | "en" | "de" | "ru" | null;

void i18n.use(initReactI18next).init({
    resources,
    lng: saved ?? "en",          // EN by default
    fallbackLng: "en",
    supportedLngs: ["en", "de", "ru"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    debug: import.meta.env.DEV,
});

export default i18n;
