import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// 📦 Инициализация i18next
i18n
  .use(HttpBackend) // Загрузка переводов по HTTP
  .use(LanguageDetector) // Автоопределение языка
  .use(initReactI18next) // Подключение к react-i18next
  .init({
    fallbackLng: "uk", // Язык по умолчанию
    supportedLngs: ["uk", "en", "ru"],

    debug: process.env.NODE_ENV === "development",

    detection: {
      order: ["localStorage", "navigator", "htmlTag", "cookie"],
      caches: ["localStorage"],
    },

    backend: {
      // 🔽 Убедись, что файлы translation.json лежат в /public/locales/{{lng}}/
      loadPath: "/locales/{{lng}}/translation.json",
    },

    interpolation: {
      escapeValue: false, // React уже экранирует
    },

    react: {
      useSuspense: true, // Показывает fallback при загрузке переводов
    },
  });

// ✅ Автоматическое обновление <html lang="...">
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", lng);
  }
});

export default i18n;
