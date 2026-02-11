"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@/app/lib/i18n/locales";

function getLocaleFromPathname(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0];
}

export function HtmlLocaleSync() {
  const pathname = usePathname();

  useEffect(() => {
    const candidate = getLocaleFromPathname(pathname);
    const locale = candidate && isLocale(candidate) ? candidate : DEFAULT_LOCALE;
    const dir = locale === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [pathname]);

  return null;
}

