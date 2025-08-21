import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import uk from './locales/uk.json';
import ru from './locales/ru.json';

const languages = ['uk', 'en', 'ru'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      ru: { translation: ru },
    },
    fallbackLng: 'uk',
    supportedLngs: languages,
    detection: {
      order: ['localStorage', 'htmlTag', 'cookie', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

export default i18n;