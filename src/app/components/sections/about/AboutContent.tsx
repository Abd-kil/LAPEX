"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { AdvantageCard } from "@/app/components/sections/AdvantageCard";

export function AboutContent() {
  const { t } = useI18n();

  return (
    <div className="space-y-10">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("about.title")}</h1>
          <p className="mt-4 text-sm leading-7 text-foreground/75">{t("about.p1")}</p>
          <p className="mt-4 text-sm leading-7 text-foreground/75">{t("about.p2")}</p>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/about-image.png"
            alt={t("a11y.aboutSideImageAlt")}
            width={520}
            height={520}
            className="h-auto w-full max-w-[520px] rounded-3xl object-cover"
          />
        </div>
      </section>

      {/* <section className="grid gap-4 md:grid-cols-3">
        <AdvantageCard icon="store" titleKey="about.statsValues.stores" textKey="about.stats.stores" titleClassName="text-xl" />
        <AdvantageCard icon="user" titleKey="about.statsValues.visitors" textKey="about.stats.visitors" titleClassName="text-xl" />
        <AdvantageCard icon="laptop" titleKey="about.statsValues.laptops" textKey="about.stats.laptops" titleClassName="text-xl" />
      </section> */}

      <section className="grid gap-4 md:grid-cols-3">
        <AdvantageCard icon="review" titleKey="home.advantages.compReview" textKey="home.advantages.compReviewText" />
        <AdvantageCard icon="dollar" titleKey="home.advantages.priceComparison" textKey="home.advantages.priceComparisonText" />
        <AdvantageCard icon="scale" titleKey="home.advantages.unbiasedInfo" textKey="home.advantages.unbiasedInfoText" />
      </section>
    </div>
  );
}

