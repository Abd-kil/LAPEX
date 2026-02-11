"use client";

import { useI18n } from "@/app/components/i18n/I18nProvider";
import Link from "next/link";

export function ViewAllFooter(props: { href: string }) {
  const { t } = useI18n();
  return (
    <div className="flex justify-center">
      <Link href={props.href} className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
        {t("common.viewAll")}
      </Link>
    </div>
  );
}

