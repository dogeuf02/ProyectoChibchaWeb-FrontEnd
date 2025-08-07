import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector) // 🔥 Añade el detector
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    fallbackLng: 'en', // En caso de que no detecte o falte idioma
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'], // primero localStorage
      caches: ['localStorage'] // guarda el idioma en localStorage
    }
  });

export default i18n;
