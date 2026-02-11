"use client";

import Link from "next/link";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { withLocale } from "@/app/lib/i18n/routing";

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-background p-10 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("notFound.title")}</h1>
      <Link href={withLocale(locale, "/")}>
        <button className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          {t("notFound.backHome")}
        </button>
      </Link>
    </div>
  );
}

