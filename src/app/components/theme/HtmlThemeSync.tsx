"use client";

import { useEffect } from "react";
import { applyThemeToDocument, getEffectiveTheme, readStoredTheme } from "@/app/lib/theme/theme";

export function HtmlThemeSync() {
  useEffect(() => {
    // Always set an explicit theme so CSS tokens are deterministic.
    // If the user didn't pick a theme yet, follow the system theme.
    applyThemeToDocument(getEffectiveTheme());

    // If the user hasn't stored a preference, keep following the system.
    const hasStored = readStoredTheme() !== null;
    if (hasStored) return;

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;

    const onChange = () => applyThemeToDocument(getEffectiveTheme());
    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return null;
}

