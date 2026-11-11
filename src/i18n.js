import { createInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

export const UI_LANGUAGE_STORAGE_KEY = "uiLanguage";

// Languages offered in the switcher, each named in its own language.
// To add one, see "How to add a language" in CONTRIBUTING.md.
export const UI_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

const i18n = createInstance();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    supportedLngs: UI_LANGUAGES.map((language) => language.code),
    // Lets regional browser languages like es-MX use the es messages
    nonExplicitSupportedLngs: true,
    // Missing keys fall back to English
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      // A choice saved by the switcher wins, then the browser language
      order: ["localStorage", "navigator"],
      lookupLocalStorage: UI_LANGUAGE_STORAGE_KEY,
      caches: [],
    },
  });

const setHtmlLang = (language) => {
  document.documentElement.lang = language;
};
setHtmlLang(i18n.resolvedLanguage || "en");
i18n.on("languageChanged", () => setHtmlLang(i18n.resolvedLanguage || "en"));

export default i18n;
