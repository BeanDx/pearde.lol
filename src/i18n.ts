import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      hello: "Yo, I'm {{name}}",
      nav: { home: "Home", rices: "Rices", contacts: "Contacts" },
      bio: {
        name: "Name",
        age: "Age",
        location: "Location",
        os: "OS",
        languages: "Languages",
        info: "Info"
      }
    }
  },
  de: {
    common: {
      hello: "Moin, ich bin {{name}}",
      nav: { home: "Start", rices: "Rices", contacts: "Kontakte" },
      bio: {
        name: "Name",
        age: "Alter",
        location: "Ort",
        os: "Betriebssystem",
        languages: "Sprachen",
        info: "Info"
      }
    }
  }
} as const;


const saved = (typeof window !== "undefined" && localStorage.getItem("lng")) as
    | "en"
    | "de"
    | null;

void i18n.use(initReactI18next).init({
    resources,
    lng: saved ?? "en",
    fallbackLng: "en",
    supportedLngs: ["en", "de"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    debug: import.meta.env.DEV,
});

export default i18n;
