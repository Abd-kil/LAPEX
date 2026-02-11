"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { SearchBar } from "@/app/components/layout/SearchBar";
import {
  IconArrowRight,
  IconGlobe,
  IconHeart,
  IconMenu,
  IconMoon,
  IconSearch,
  IconSun,
} from "@/app/components/ui/Icon";
import { withLocale, type AppRoute } from "@/app/lib/i18n/routing";
import {
  applyThemeToDocument,
  getEffectiveTheme,
  setStoredTheme,
  type Theme,
} from "@/app/lib/theme/theme";
import Logo from "../ui/Logo";

const NAV_LINKS: Array<{ key: string; href: AppRoute }> = [
  { key: "nav.home", href: "/" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.about", href: "/about" },
  { key: "nav.login", href: "/login" },
];

function stripLocale(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

function swapLocaleInPathname(
  pathname: string,
  currentLocale: string,
  nextLocale: string,
): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && segments[0] === currentLocale)
    segments[0] = nextLocale;
  else segments.unshift(nextLocale);
  return `/${segments.join("/")}`;
}

function SiteHeaderContent() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = useMemo(
    () => stripLocale(pathname, locale),
    [locale, pathname],
  );

  const [isNavOpened, setIsNavOpened] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  // show nav on scroll up
  const [isNavVisible, setIsNavVisible] = useState(true);
  const prevScrollPosition = useRef(0);

  useEffect(() => {
    document.body.style.overflow = isNavOpened ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNavOpened]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - prevScrollPosition.current;
      if (delta > 10) setIsNavVisible(false);
      else if (delta < -10) setIsNavVisible(true);
      prevScrollPosition.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // keep local UI state in sync with effective theme
    setTheme(getEffectiveTheme());
  }, []);

  const otherLocale = locale === "ar" ? "en" : "ar";
  const languageHref = useMemo(() => {
    const base = swapLocaleInPathname(pathname, locale, otherLocale);
    const qs = searchParams?.toString();
    return qs ? `${base}?${qs}` : base;
  }, [locale, otherLocale, pathname, searchParams]);

  const themeActionLabel =
    theme === "dark" ? t("nav.lightMode") : t("nav.darkMode");

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur transition-transform duration-300",
        isNavOpened || isNavVisible ? "translate-y-0" : "-translate-y-[110%]",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 px-4 py-4">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground sm:hidden"
          aria-label={isNavOpened ? t("a11y.closeMenu") : t("a11y.openMenu")}
          onClick={() => setIsNavOpened((v) => !v)}
        >
          <IconMenu className="h-5 w-5" />
        </button>

        <Link
          href={withLocale(locale, "/")}
          className={[
            "text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80",
            isSearchVisible ? "hidden sm:inline" : "",
          ].join(" ")}
        >
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden flex-1 justify-center sm:flex">
            <SearchBar isVisible />
          </div>
          <div className="sm:hidden w-full">
            <SearchBar isVisible={isSearchVisible} />
          </div>
          <div className="flex items-center gap-2 w-content h-10">
            <button
              type="button"
              className={
                !isSearchVisible
                  ? "hidden"
                  : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground sm:hidden"
              }
              aria-label={t("a11y.closeSearch")}
              onClick={() => setIsSearchVisible(false)}
            >
              <IconArrowRight className="h-5 w-5" />
            </button>

            <div
              className={[
                isSearchVisible && "hidden sm:flex",
                "w-content flex items-center gap-2",
              ].join(" ")}
            >
              {/* Desktop: theme + language (icons only) */}
              <button
                type="button"
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label={themeActionLabel}
                title={themeActionLabel}
                onClick={() => {
                  const next: Theme = theme === "dark" ? "light" : "dark";
                  setStoredTheme(next);
                  applyThemeToDocument(next);
                  setTheme(next);
                }}
              >
                {theme === "dark" ? (
                  <IconSun className="h-5 w-5" />
                ) : (
                  <IconMoon className="h-5 w-5" />
                )}
              </button>

              <Link
                href={languageHref}
                className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label={t("a11y.toggleLanguage")}
                title={t("a11y.toggleLanguage")}
              >
                <IconGlobe className="h-5 w-5" />
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground sm:hidden"
                aria-label={t("a11y.openSearch")}
                onClick={() => setIsSearchVisible(true)}
              >
                <IconSearch className="h-5 w-5" />
              </button>
              <Link
                href={withLocale(locale, "/favorite")}
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground",
                  isSearchVisible ? "hidden sm:inline-flex" : "",
                ].join(" ")}
                aria-label={t("a11y.favorite")}
              >
                <IconHeart className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav
        className={[
          "mx-auto hidden w-full max-w-[1240px] items-center justify-center gap-6 px-4 pb-3 text-sm sm:flex",
          isSearchVisible ? "opacity-40" : "",
        ].join(" ")}
      >
        {NAV_LINKS.map((item) => {
          const href = withLocale(locale, item.href);
          const isActive = currentRoute === item.href;
          return (
            <Link
              key={item.key}
              href={href}
              className={[
                "rounded-full px-3 py-1.5 transition",
                isActive
                  ? "bg-foreground/5 text-foreground"
                  : "text-foreground/75 hover:bg-foreground/5 hover:text-foreground",
              ].join(" ")}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* Mobile overlay */}
      {isNavOpened ? (
        <div className="sm:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            aria-label={t("a11y.closeMenu")}
            onClick={() => setIsNavOpened(false)}
          />
          <div className="fixed inset-x-0 top-[72px] z-50 rounded-b-2xl border-b border-border bg-background p-4 shadow-lg">
            <nav className="flex flex-col gap-1 text-sm">
              {/* Mobile: theme + language (icon + text) */}
              <button
                type="button"
                className="flex w-full justify-between items-center gap-3 rounded-xl px-3 py-3 text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label={themeActionLabel}
                onClick={() => {
                  const next: Theme = theme === "dark" ? "light" : "dark";
                  setStoredTheme(next);
                  applyThemeToDocument(next);
                  setTheme(next);
                  setIsNavOpened(false);
                }}
              >
                <span className="font-medium">{themeActionLabel}</span>
                {theme === "dark" ? (
                  <IconSun className="h-5 w-5" />
                ) : (
                  <IconMoon className="h-5 w-5" />
                )}
              </button>

              <Link
                href={languageHref}
                onClick={() => setIsNavOpened(false)}
                className="flex justify-between items-center gap-3 rounded-xl px-3 py-3 text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
                aria-label={t("a11y.toggleLanguage")}
              >
                <span className="font-medium">
                  {otherLocale === "en"
                    ? t("nav.switchToEn")
                    : t("nav.switchToAr")}
                </span>
                    <IconGlobe className="h-5 w-5" />
              </Link>

              {NAV_LINKS.map((item) => {
                const href = withLocale(locale, item.href);
                const isActive = currentRoute === item.href;
                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={() => setIsNavOpened(false)}
                    className={[
                      "rounded-xl px-3 py-3 transition",
                      isActive
                        ? "bg-foreground/5 text-foreground"
                        : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
                    ].join(" ")}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur" />
      }
    >
      <SiteHeaderContent />
    </Suspense>
  );
}
