"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { Countdown, type CountdownDate } from "@/app/components/ui/Countdown";
import { IconArrowRight } from "@/app/components/ui/Icon";

export function ProductsSection({
  kickerKey,
  titleKey,
  countdownTo,
  scrollable = false,
  twoRows = false,
  children,
  footer,
}: {
  kickerKey: string;
  titleKey: string;
  countdownTo?: CountdownDate;
  scrollable?: boolean;
  twoRows?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const offset = window.innerWidth / 1.5;
    const delta = dir === "right" ? offset : -offset;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-6 w-2.5 rounded-full bg-primary" />
              <p className="text-lg font-semibold text-primary">{t(kickerKey)}</p>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t(titleKey)}
            </h2>
          </div>
          {countdownTo ? <Countdown to={countdownTo} showColons /> : null}
        </div>

        {scrollable ? (
          <div className="flex items-center gap-2" dir="ltr">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
              aria-label={t("a11y.scrollLeft")}
              onClick={() => scrollBy("left")}
            >
              <IconArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
              aria-label={t("a11y.scrollRight")}
              onClick={() => scrollBy("right")}
            >
              <IconArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={trackRef}
        className={[
          "mt-8 flex gap-4",
          scrollable ? "overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex-wrap",
          twoRows ? "md:grid md:grid-flow-col md:grid-rows-2 md:gap-4" : "",
        ].join(" ")}
      >
        {children}
      </div>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </section>
  );
}

