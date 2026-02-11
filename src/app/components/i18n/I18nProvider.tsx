"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/app/lib/i18n/locales";
import type { Dictionary, TranslateParams } from "@/app/lib/i18n/types";
import { createTranslator } from "@/app/lib/i18n/createTranslator";

type I18nContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  t: (key: string, params?: TranslateParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: createTranslator(dict),
    };
  }, [dict, locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

