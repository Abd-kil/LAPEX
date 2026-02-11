"use client";

import { useI18n } from "@/app/components/i18n/I18nProvider";
import { IconStar } from "@/app/components/ui/Icon";

export function RatingStars({ value }: { value: 0 | 1 | 2 | 3 | 4 | 5 }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-0.5" aria-label={t("a11y.rating", { value })}>
      {([1, 2, 3, 4, 5] as const).map((n) => {
        const filled = value >= n;
        return (
          <IconStar
            key={n}
            className={[
              "h-4 w-4",
              filled ? "fill-accent stroke-accent" : "fill-muted stroke-muted-foreground/30",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

