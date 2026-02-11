"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/i18n/I18nProvider";

export type AdvertSize = "vertical" | "horizontal" | "small";

export function AdvertCard({
  size,
  imageSrc,
  titleKey,
  detailsKey,
}: {
  size: AdvertSize;
  imageSrc: string;
  titleKey: string;
  detailsKey: string;
}) {
  const { t } = useI18n();

  const sizeClasses =
    size === "vertical"
      ? "md:row-span-2"
      : size === "horizontal"
        ? "md:col-span-2"
        : "";

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl bg-secondary text-secondary-foreground",
        "min-h-[220px] border border-border/40 p-6",
        sizeClasses,
      ].join(" ")}
    >
      <Image
        src={imageSrc}
        alt={t(titleKey)}
        width={900}
        height={900}
        className={[
          "absolute inset-0 h-full w-full object-contain opacity-90 transition-transform duration-500",
          "group-hover:scale-[1.03]",
        ].join(" ")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <h3 className="text-xl font-semibold tracking-tight">{t(titleKey)}</h3>
        <p className="mt-1 max-w-[38ch] text-sm text-secondary-foreground/85">{t(detailsKey)}</p>
        <button
          type="button"
          className="mt-3 w-fit rounded-lg border border-secondary-foreground/30 bg-secondary-foreground/5 px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary-foreground/10"
        >
          {t("common.shopNow")}
        </button>
      </div>
    </article>
  );
}

