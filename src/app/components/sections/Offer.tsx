"use client";

import Image from "next/image";
import { useI18n } from "@/app/components/i18n/I18nProvider";
import { Countdown, type CountdownDate } from "@/app/components/ui/Countdown";
import Link from "next/link";

export function Offer(props: {
  imageSrc: string;
  countdownTo?: CountdownDate;
  href: string;
}) {
  const { t } = useI18n();

  return (
    <section className="py-10">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-center">
        <div className="grid w-full gap-8 rounded-3xl bg-secondary px-6 py-10 text-secondary-foreground md:grid-cols-2 md:px-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-primary">{t("home.mac.label")}</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("home.mac.title")}
            </h3>

            {props.countdownTo ? (
              <div className="mt-6">
                <Countdown to={props.countdownTo} />
              </div>
            ) : null}

            <Link
              href={props.href}
              className="mt-7 inline-flex w-fit items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t("common.buyNow")}
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src={props.imageSrc}
              alt={t("a11y.offerImageAlt")}
              width={320}
              height={320}
              className="h-auto w-full max-w-[320px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)]"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

