import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

export function getLocaleFromParams(params: { locale?: string }): Locale {
  const { locale } = params;
  if (locale && isLocale(locale)) return locale;
  return DEFAULT_LOCALE;
}

