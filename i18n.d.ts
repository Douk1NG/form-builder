import 'i18next';
import enTranslations from './src/locales/en/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: typeof enTranslations;
    };
  }
}