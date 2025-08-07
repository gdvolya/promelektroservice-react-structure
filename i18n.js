import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json'; // Путь к файлам с переводами
import uk from './locales/uk.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    lng: 'uk', // начальный язык
    fallbackLng: 'en', // если перевод для выбранного языка не найден
    interpolation: {
      escapeValue: false, // для XSS безопасности
    },
  });

export default i18n;
