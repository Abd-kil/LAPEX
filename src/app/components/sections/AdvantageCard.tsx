"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import {
  IconDollar,
  IconHeadset,
  IconLaptop,
  IconReview,
  IconScale,
  IconShieldCheck,
  IconStore,
  IconUser,
} from "@/app/components/ui/Icon";

type AdvantageIcon = "user" | "headset" | "scale" | "store" | "laptop" | "dollar" | "review";

function getIcon(name: AdvantageIcon): ReactNode {
  switch (name) {
    case "user":
      return <IconUser className="h-7 w-7" />;
    case "headset":
      return <IconHeadset className="h-7 w-7" />;
    case "scale":
      return <IconScale className="h-7 w-7" />;
    case "store":
      return <IconStore className="h-7 w-7" />;
    case "laptop":
      return <IconLaptop className="h-7 w-7" />;
    case "dollar":
      return <IconDollar className="h-7 w-7" />;
    case "review":
      return <IconReview className="h-7 w-7" />;
  }
}

export function AdvantageCard({
  icon,
  titleKey,
  textKey,
  titleClassName,
}: {
  icon: AdvantageIcon;
  titleKey: string;
  textKey: string;
  titleClassName?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="flex w-full items-start gap-4 rounded-2xl border border-border bg-background p-5 transition hover:bg-muted/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
        {getIcon(icon)}
      </div>
      <div className="min-w-0">
        <h4 className={["font-semibold text-foreground", titleClassName ?? ""].join(" ")}>
          {t(titleKey)}
        </h4>
        <p className="mt-1 text-sm text-foreground/70">{t(textKey)}</p>
      </div>
    </div>
  );
}

