import type { Locale } from "./locales";
import type { Dictionary } from "./types";

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "ar":
      return (await import("./messages/ar.json")).default as Dictionary;
    case "en":
      return (await import("./messages/en.json")).default as Dictionary;
  }
}

