import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// 📦 Инициализация i18next
i18n
  .use(HttpBackend) // Загрузка переводов по HTTP
  .use(LanguageDetector) // Автоматическое определение языка
  .use(initReactI18next) // Подключение к react-i18next
  .init({
    fallbackLng: "uk", // Язык по умолчанию, если не удалось определить
    supportedLngs: ["uk", "en", "ru"], // Поддерживаемые языки

    debug: process.env.NODE_ENV === "development", // Отладка только в режиме разработки

    detection: {
      // 🕵️ Порядок определения языка
      // 1. Поиск языка в URL (самый высокий приоритет для SEO)
      // 2. Поиск в localStorage
      // 3. Определение по настройкам браузера
      // 4. Определение по тегу <html>
      order: ["path", "localStorage", "navigator", "htmlTag", "cookie"],
      
      // 📍 Настройка для поиска языка в URL (в первом сегменте, например, /uk/about)
      lookupFromPathIndex: 0,
      
      // 💾 Кэширование определённого языка в localStorage
      caches: ["localStorage"],
    },

    backend: {
      // 🔽 Путь для загрузки JSON-файлов с переводами.
      // Файлы должны быть в public/locales/{{lng}}/translation.json
      loadPath: "/locales/{{lng}}/translation.json",
    },

    interpolation: {
      escapeValue: false, // React уже экранирует данные
    },

    react: {
      useSuspense: true, // Показывает fallback при загрузке переводов
    },
  });

// ✅ Автоматическое обновление атрибута lang в теге <html>
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", lng);
  }
});

export default i18n;