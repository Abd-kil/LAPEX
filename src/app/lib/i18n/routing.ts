import type { Locale } from "./locales";

export type AppRoute =
  | "/"
  | "/about"
  | "/contact"
  | "/login"
  | "/sign-up"
  | "/favorite"
  | "/check-out";

export function withLocale(locale: Locale, route: AppRoute): string {
  return route === "/" ? `/${locale}` : `/${locale}${route}`;
}

export function productDetailsHref(locale: Locale, slug: number): string {
  return `/${locale}/product/${slug}`;
}

