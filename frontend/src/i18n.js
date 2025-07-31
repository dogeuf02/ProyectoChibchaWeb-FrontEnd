import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(initReactI18next) // conecta i18n con React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: 'en', // idioma por defecto
    fallbackLng: 'es', // si falta traducción, usa inglés
    interpolation: {
      escapeValue: false // para que React maneje XSS
    }
  });

export default i18n;
