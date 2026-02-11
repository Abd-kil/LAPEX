export type Theme = "light" | "dark";

const STORAGE_KEY = "lapex-theme";

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" ? raw : null;
}

export function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getEffectiveTheme(): Theme {
  return readStoredTheme() ?? getSystemTheme();
}

export function applyThemeToDocument(theme: Theme | null) {
  if (typeof document === "undefined") return;
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
    // Helps built-in UI (form controls/scrollbars) match.
    document.documentElement.style.colorScheme = theme;
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("color-scheme");
  }
}

export function setStoredTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
}

