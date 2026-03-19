import { Locale, defaultLocale } from "./config";

const LOCALE_KEY = "mella_locale";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  return (localStorage.getItem(LOCALE_KEY) as Locale) || defaultLocale;
}

export function setStoredLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_KEY, locale);
    // Optionally reload or use a state manager to update the UI
  }
}

export function setLocaleCookie(locale: Locale) {
  if (typeof document !== "undefined") {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
  }
}
