"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/i18n/I18nProvider";

export function ProductAdvantage({
  iconSrc,
  titleKey,
  textKey,
}: {
  iconSrc: string;
  titleKey: string;
  textKey: string;
}) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
      <Image src={iconSrc} alt="" width={40} height={40} className="h-10 w-10" />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-foreground">{t(titleKey)}</h4>
        <p className="mt-1 text-xs text-foreground/70">{t(textKey)}</p>
      </div>
    </div>
  );
}

